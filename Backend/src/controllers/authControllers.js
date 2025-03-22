const supabase = require('../config/supabaseClient');

exports.signup = async (req, res) => {
    try {

        console.log("Received signup requests;", req.body);
        const { email, password, name } = req.body;
        
        // Check if the user already exists
        const { data: existUser } = await supabase
            .from('customer')
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
                    full_name:name
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
            .from('customer')
            .insert({
                id: authData.user.id,
                email,
                full_name:name,
                created_at: new Date().toISOString()
            });

        if (profileError) {
            console.error("Profile createion error:",profileError)
            return res.status(500).json({
                error: 'Failed to create the profile'
            });
        }

        if(authData.session){
            const {access_token,refresh_token}=authData.session;

            res.cookie('sb-access-token',access_token,{
                httpOnly:true,
                secure:process.env.NODE_ENV === 'production',
                sameSite:'strict',
                maxAge:3600 * 1000
            });

            res.cookie('sb-refresh-token', refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 3600 * 1000 
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

        console.log("Signing in user:",email);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error("Supabase Auth Error",error.message)
            return res.status(401).json({
                error: "Invalid login credentials"
            });
        }

        const { data: profileData } = await supabase
            .from('customer')
            .select('*')
            .eq('id', data.user.id)
            .single();

            if (data.session) {
                const { access_token, refresh_token } = data.session;
                
                // Set secure HTTP-only cookies
                res.cookie('sb-access-token', access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 3600 * 1000 // 1 hour
                });
                
                res.cookie('sb-refresh-token', refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 3600 * 1000 // 7 days
                });
            }


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
        const { id_token } = req.body;

        let authResponse;

        switch (provider) {
            case 'google':
            case 'facebook':
            case 'apple':
                authResponse = await supabase.auth.signInWithIdToken({
                    provider,
                    token:  id_token 
                });
                break;
            default:
                return res.status(400).json({
                    error: 'Unsupported social login'
                });
        }

        console.log("Supabase Auth Response:",authResponse);

        const { data, error } = authResponse;

        if (error) {
            return res.status(401).json({
                error: 'Social login failed',
                details: error.message
            });
        }

        const { error: profileError } = await supabase
            .from('customer')
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
        if (data.session) {
            const { access_token, refresh_token } = data.session;
            
            // Set secure HTTP-only cookies
            res.cookie('sb-access-token', access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600 * 1000 // 1 hour
            });
            
            res.cookie('sb-refresh-token', refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 3600 * 1000 // 7 days
            });
        }


        res.status(200).json({
            message: 'Social login successful',
            user: {
                id: data.user.id,
                email:data. user.email,
                full_name: data.user.user_metadata?.full_name
            },
            session: session
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

    // Clear auth cookies
        res.clearCookie('sb-access-token');
        res.clearCookie('sb-refresh-token');

        res.status(200).json({
            message: 'Logged out successfully'
        });    



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

exports.getSession = async (req, res) => {
    try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
            return res.status(401).json({
                error: 'No active session',
                details: error.message
            });
        }
        
        if (!data.session) {
            return res.status(401).json({
                error: 'No active session'
            });
        }
        
        // Get user profile
        const { data: profileData } = await supabase
            .from('customer')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
        res.status(200).json({
            user: {
                id: data.session.user.id,
                email: data.session.user.email,
                full_name: profileData?.full_name
            }
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get session',
            details: error.message
        });
    }
};

// New method to refresh session
exports.refreshSession = async (req, res) => {
    try {
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
            return res.status(401).json({
                error: 'Failed to refresh session',
                details: error.message
            });
        }
        
        if (data.session) {
            const { access_token, refresh_token } = data.session;
            
            // Update auth cookies
            res.cookie('sb-access-token', access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600 * 1000 // 1 hour
            });
            
            res.cookie('sb-refresh-token', refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 3600 * 1000 // 7 days
            });
        }
        
        res.status(200).json({
            message: 'Session refreshed successfully',
            user: data.user
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Failed to refresh session',
            details: error.message
        });
    }
};

// Middleware to check authentication
exports.requireAuth = async (req, res, next) => {
    try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
            return res.status(401).json({
                error: 'Authentication required'
            });
        }
        
        // Add user to request object
        req.user = data.session.user;
        
        next();
    } catch (error) {
        res.status(500).json({
            error: 'Authentication check failed',
            details: error.message
        });
    }
};
