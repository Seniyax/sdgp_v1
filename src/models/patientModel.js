const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// patientModel class
class patientModel {
    static async createPatient(userId, medicalHistory, contactNumber) {
        const { data, error } = await supabase
            .from('patients')  // Assuming you have a 'patients' table
            .insert([
                { user_id: userId, medical_history: medicalHistory, contact_number: contactNumber }
            ]);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async getAllPatients() {
        const { data, error } = await supabase
            .from('patients')
            .select('*');

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async getPatientById(id) {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async updatePatient(id, medicalHistory, contactNumber) {
        const { data, error } = await supabase
            .from('patients')
            .update({ medical_history: medicalHistory, contact_number: contactNumber })
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async deletePatient(id) {
        const { data, error } = await supabase
            .from('patients')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}

module.exports = patientModel;
