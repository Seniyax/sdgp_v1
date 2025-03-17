const supabase = require('../config/supabaseClient');
const logger = require('../utils/logger');

class ReservationService {
    async createReservation(reservationData) {
        try {
            // Get the slot to fetch business_id
            const { data: slot, error: slotError } = await supabase
                .from('slot')
                .select('business_id')
                .eq('id', reservationData.slot_id)
                .single();
                
            if (slotError) throw slotError;
            
            // Create the reservation with business_id
            const { data, error } = await supabase
                .from('reservation')
                .insert([{
                    ...reservationData,
                    business_id: slot.business_id
                }])
                .select('*, slot(*), business:business_id(*)')
                .single();
                
            if (error) throw error;
            return data;
        } catch (error) {
            logger.error(`Error creating reservation: ${error.message}`, { error });
            throw error;
        }
    }

    async getReservation(id) {
        const { data, error } = await supabase
            .from('reservation')
            .select('*, slot(*), business:business_id(*)')
            .eq('id', id)
            .single();
            
        if (error) {
            logger.error(`Error fetching reservation ${id}: ${error.message}`);
            throw error;
        }
        
        return data;
    }

    async getReservationsByUser(userId) {
        const { data, error } = await supabase
            .from('reservation')
            .select('*, slot(*), business:business_id(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
            
        if (error) {
            logger.error(`Error fetching user reservations: ${error.message}`);
            throw error;
        }
        
        return data;
    }

    async getReservationsByRestaurant(businessId, status = null, date = null) {
        let query = supabase
            .from('reservation')
            .select('*, slot(*), user:user_id(*)')
            .eq('business_id', businessId);
            
        // Add status filter if provided
        if (status) {
            query = query.eq('status', status);
        }
        
        // Add date filter if provided
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            
            query = query
                .gte('start_time', startOfDay.toISOString())
                .lte('start_time', endOfDay.toISOString());
        }
        
        // Execute query
        const { data, error } = await query.order('start_time', { ascending: true });
        
        if (error) {
            logger.error(`Error fetching business reservations: ${error.message}`);
            throw error;
        }
        
        return data;
    }

    async updateReservation(id, updateData) {
        try {
            const { data, error } = await supabase
                .from('reservation')
                .update(updateData)
                .eq('id', id)
                .select('*, slot(*), business:business_id(*)')
                .single();
                
            if (error) throw error;
            return data;
        } catch (error) {
            logger.error(`Error updating reservation: ${error.message}`, { error });
            throw error;
        }
    }

    async cancelReservation(id) {
        const { data, error } = await supabase
            .from('reservation')
            .update({ status: 'CANCELLED' })
            .eq('id', id);
            
        if (error) {
            logger.error(`Error cancelling reservation ${id}: ${error.message}`);
            throw error;
        }
        
        return true;
    }

    async checkSlotAvailability(slotId, startTime, endTime, peopleCount, excludeReservationId = null) {
        try {
            // Get slot details first
            const { data: slot, error: slotError } = await supabase
                .from('slot')
                .select('*')
                .eq('id', slotId)
                .single();
                
            if (slotError) throw slotError;
            if (!slot) throw new Error('Slot not found');
            
            // Check if people count exceeds capacity
            if (peopleCount > slot.capacity) {
                return false;
            }
            
            // Check for overlapping reservations
            let query = supabase
                .from('reservation')
                .select('*')
                .eq('slot_id', slotId)
                .neq('status', 'CANCELLED')
                .or(`start_time.lte.${endTime},end_time.gte.${startTime}`);
                
            // Exclude current reservation if updating
            if (excludeReservationId) {
                query = query.neq('id', excludeReservationId);
            }
            
            const { data: overlappingReservations, error } = await query;
            
            if (error) throw error;
            
            // Also check if the requested time is within the slot's operating hours
            const requestStart = new Date(startTime);
            const requestEnd = new Date(endTime);
            const slotStart = new Date(slot.start_time);
            const slotEnd = new Date(slot.end_time);
            
            const isWithinHours = requestStart >= slotStart && requestEnd <= slotEnd;
            
            return overlappingReservations.length === 0 && isWithinHours;
        } catch (error) {
            logger.error('Error checking slot availability:', error);
            return false;
        }
    }

    async getAvailableSlots(businessId, date) {
        try {
            // Convert date string to Date object
            const requestedDate = new Date(date);
            const dayOfWeek = requestedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
            
            // Format date for SQL query (YYYY-MM-DD)
            const formattedDate = requestedDate.toISOString().split('T')[0];
            
            // Get all slots for the restaurant on the requested day of week
            const { data: slots, error: slotsError } = await supabase
                .from('slot')
                .select('*')
                .eq('business_id', businessId)
                .eq('day_of_week', dayOfWeek);
                
            if (slotsError) throw slotsError;
            
            // For each slot, check existing reservations
            const availabilityPromises = slots.map(async (slot) => {
                // Get all reservations for this slot on the requested date
                const { data: reservations, error: reservationsError } = await supabase
                    .from('reservation')
                    .select('*')
                    .eq('slot_id', slot.id)
                    .neq('status', 'CANCELLED')
                    .gte('start_time', `${formattedDate}T00:00:00`)
                    .lte('start_time', `${formattedDate}T23:59:59`);
                    
                if (reservationsError) throw reservationsError;
                
                // Calculate remaining capacity and available time slots
                const bookedTimes = reservations.map(r => ({
                    start: new Date(r.start_time),
                    end: new Date(r.end_time)
                }));
                
                // Create base slot with availability info
                return {
                    ...slot,
                    date: formattedDate,
                    reservations: reservations,
                    remaining_capacity: slot.capacity - reservations.reduce((sum, r) => sum + r.people_count, 0)
                };
            });
            
            const availableSlots = await Promise.all(availabilityPromises);
            
            return availableSlots;
        } catch (error) {
            logger.error(`Error fetching available slots: ${error.message}`);
            throw error;
        }
    }

    async isUpdateAllowed(id) {
        const reservation = await this.getReservation(id);
        if (!reservation) return false;
        
        // Example: Allow updates up to 24 hours before reservation
        const hours24 = 24 * 60 * 60 * 1000;
        return new Date(reservation.start_time).getTime() - Date.now() > hours24;
    }

    async isCancellationAllowed(id) {
        const reservation = await this.getReservation(id);
        if (!reservation) return false;
        
        // Example: Allow cancellation up to 12 hours before reservation
        const hours12 = 12 * 60 * 60 * 1000;
        return new Date(reservation.start_time).getTime() - Date.now() > hours12;
    }
}

module.exports = new ReservationService();