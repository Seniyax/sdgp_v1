const supabase = require('../config/supabaseClient');

exports.signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Check if the user already exists
        const { data: existUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existUser) {
            return res.status(400).json({
                error: 'User with this email already exists'
            });
        }

        // Sign up user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name
                }
            }
        });

        if (authError) {
            return res.status(400).json({
                error: authError.message
            });
        }

        // Create a profile in the users table
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email,
                name,
                created_at: new Date()
            });

        if (profileError) {
            return res.status(500).json({
                error: 'Failed to create the profile'
            });
        }

        res.status(201).json({
            message: 'User registration successful',
            user: {
                id: authData.user.id,
                email: authData.user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            error: 'Signup failed',
            details: error.message
        });
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({
                error: "Invalid login credentials"
            });
        }

        const { data: profileData } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: data.user.id,
                email: data.user.email,
                full_name: profileData?.full_name
            },
            session: data.session
        });

    } catch (error) {
        res.status(500).json({
            error: 'Login failed',
            details: error.message
        });
    }
};

exports.socialLogin = async (req, res) => {
    try {
        const { provider } = req.params;
        const { access_token } = req.body;

        let authResponse;

        switch (provider) {
            case 'google':
            case 'facebook':
            case 'apple':
                authResponse = await supabase.auth.signInWithOAuth({
                    provider,
                    options: { access_token }
                });
                break;
            default:
                return res.status(400).json({
                    error: 'Unsupported social login'
                });
        }

        const { data, error } = authResponse;

        if (error) {
            return res.status(401).json({
                error: 'Social login failed',
                details: error.message
            });
        }

        const { error: profileError } = await supabase
            .from('users')
            .upsert({
                id: data.user.id,
                email: data.user.email,
                full_name: data.user.user_metadata?.full_name || data.user.email,
                created_at: new Date()
            }, { onConflict: ['id'] });

        if (profileError) {
            return res.status(500).json({
                error: 'Failed to update user profile'
            });
        }

        res.status(200).json({
            message: 'Social login successful',
            user: {
                id: data.user.id,
                email: data.user.email,
                full_name: data.user.user_metadata?.full_name
            },
            session: data.session
        });

    } catch (error) {
        res.status(500).json({
            error: 'Social login process failed',
            details: error.message
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Logout error:', error);
            return res.status(500).json({
                error: 'Logout failed',
                details: error.message
            });
        }

        res.status(200).json({
            message: 'Logged out successfully'
        });

    } catch (error) {
        res.status(500).json({
            error: 'Logout process failed',
            details: error.message
        });
    }
};
