const { HTTP_STATUS } = require('../config/constants');
const ApiResponse = require('../utils/responses');
const reservationService = require('../services/reservationService');
const asyncHandler = require('../utils/asyncHandler');

class ReservationController {
    async createReservation(req, res) {
        const { slot_id, user_id, people_count, start_time, end_time } = req.body;

        if (!slot_id || !user_id || !people_count || !start_time || !end_time) {
            return ApiResponse.badRequest(res, {
                message: 'Missing required fields'
            });
        }

        try {
            // Check if slot is available
            const isAvailable = await reservationService.checkSlotAvailability(
                slot_id,
                start_time,
                end_time,
                people_count
            );

            if (!isAvailable) {
                return ApiResponse.badRequest(res, {
                    message: 'Slot is not available or capacity exceeded'
                });
            }

            const reservation = await reservationService.createReservation({
                slot_id,
                user_id,
                people_count,
                start_time,
                end_time,
                status: 'PENDING' // Initial status
            });

            return ApiResponse.created(res, {
                message: 'Reservation created successfully',
                data: reservation
            });
        } catch (error) {
            console.error('Reservation creation error:', error);
            return ApiResponse.error(res, {
                message: 'Error creating reservation',
                errors: error.message
            });
        }
    }

    async getReservationHistory(req, res) {
        const { userId } = req.params;

        try {
            const reservations = await reservationService.getReservationsByUser(userId);
            return ApiResponse.success(res, {
                data: reservations
            });
        } catch (error) {
            return ApiResponse.error(res, {
                message: 'Error fetching reservation history',
                errors: error.message
            });
        }
    }

    async getReservation(req, res) {
        const { id } = req.params;

        try {
            const reservation = await reservationService.getReservation(id);

            if (!reservation) {
                return ApiResponse.notFound(res, {
                    message: 'Reservation not found'
                });
            }

            return ApiResponse.success(res, {
                data: reservation
            });
        } catch (error) {
            return ApiResponse.error(res, {
                message: 'Error fetching reservation',
                errors: error.message
            });
        }
    }

    async updateReservation(req, res) {
        const { id } = req.params;
        const { people_count, start_time, end_time } = req.body;

        try {
            const existingReservation = await reservationService.getReservation(id);

            if (!existingReservation) {
                return ApiResponse.notFound(res, {
                    message: 'Reservation not found'
                });
            }

            // Check if update is allowed (not too close to reservation time)
            if (!await reservationService.isUpdateAllowed(id)) {
                return ApiResponse.badRequest(res, {
                    message: 'Reservation cannot be updated at this time'
                });
            }

            // If times are being updated, check availability
            if (start_time && end_time) {
                const isAvailable = await reservationService.checkSlotAvailability(
                    existingReservation.slot_id,
                    start_time,
                    end_time,
                    people_count || existingReservation.people_count,
                    id // Exclude current reservation from check
                );

                if (!isAvailable) {
                    return ApiResponse.badRequest(res, {
                        message: 'Requested time slot is not available'
                    });
                }
            }

            const updatedReservation = await reservationService.updateReservation(id, {
                people_count,
                start_time,
                end_time
            });

            return ApiResponse.success(res, {
                message: 'Reservation updated successfully',
                data: updatedReservation
            });
        } catch (error) {
            return ApiResponse.error(res, {
                message: 'Error updating reservation',
                errors: error.message
            });
        }
    }

    async cancelReservation(req, res) {
        const { id } = req.params;

        try {
            const reservation = await reservationService.getReservation(id);

            if (!reservation) {
                return ApiResponse.notFound(res, {
                    message: 'Reservation not found'
                });
            }

            // Check if cancellation is allowed
            if (!await reservationService.isCancellationAllowed(id)) {
                return ApiResponse.badRequest(res, {
                    message: 'Reservation cannot be cancelled at this time'
                });
            }

            await reservationService.cancelReservation(id);

            return ApiResponse.success(res, {
                message: 'Reservation cancelled successfully'
            });
        } catch (error) {
            return ApiResponse.error(res, {
                message: 'Error cancelling reservation',
                errors: error.message
            });
        }
    }

    async getAvailableSlots(req, res) {
        const { business_id, date } = req.query;
        
        if (!business_id || !date) {
            return ApiResponse.badRequest(res, {
                message: 'Business ID and date are required'
            });
        }

        try {
            const slots = await reservationService.getAvailableSlots(business_id, date);
            return ApiResponse.success(res, {
                data: slots
            });
        } catch (error) {
            return ApiResponse.error(res, {
                message: 'Error fetching available slots',
                errors: error.message
            });
        }
    }

    async getBusinessReservations(req, res) {
        const { business_id } = req.params;
        const { status, date } = req.query;
        
        try {
            const reservations = await reservationService.getReservationsByBusiness(
                business_id, 
                status, 
                date
            );
            
            return ApiResponse.success(res, {
                data: reservations
            });
        } catch (error) {
            return ApiResponse.error(res, {
                message: 'Error fetching business reservations',
                errors: error.message
            });
        }
    }
}

module.exports = new ReservationController();