const supabase = require("../config/supabaseClient");
const supabaseService = require("../config/supabaseService");

exports.signup = async (req, res) => {
  try {
    const { email, password, name, username } = req.body;

    const { data: existingUserByEmail } = await supabase
      .from("customer")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUserByEmail) {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }

    const { data: existingUserByUsername } = await supabase
      .from("customer")
      .select("*")
      .eq("username", username)
      .single();

    if (existingUserByUsername) {
      return res.status(400).json({
        error: "User with this username already exists",
      });
    }

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          username: username,
        },
      },
    });

    if (authError) {
      return res.status(400).json({
        error: authError.message,
      });
    }

    // Create a profile in the users table
    const { error: profileError } = await supabase.from("customer").insert({
      id: authData.user.id,
      email,
      full_name: name,
      username,
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return res.status(500).json({
        error: "Failed to create the profile",
      });
    }

    res.status(201).json({
      message: "User registration successful",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username: authData.user.user_metadata.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Signup failed",
      details: error.message,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Supabase Auth Error", error.message);
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    const token = data.session?.access_token;
    console.log(
      `AuthController: Received token from Supabase for user ${data.user.email}: ${token}`
    );

    const { data: profileData } = await supabase
      .from("customer")
      .select("*")
      .eq("id", data.user.id)
      .single();

    res.status(200).json({
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: profileData?.full_name,
        username: profileData?.username,
      },
      session: data.session,
    });
  } catch (error) {
    res.status(500).json({
      error: "Login failed",
      details: error.message,
    });
  }
};

exports.socialLogin = async (req, res) => {
  try {
    const { provider } = req.params;
    const { id_token } = req.body;

    let authResponse;

    switch (provider) {
      case "google":
      case "facebook":
      case "apple":
        authResponse = await supabase.auth.signInWithIdToken({
          provider,
          token: id_token,
        });
        break;
      default:
        return res.status(400).json({
          error: "Unsupported social login",
        });
    }

    const { data, error } = authResponse;

    if (error) {
      return res.status(401).json({
        error: "Social login failed",
        details: error.message,
      });
    }

    const { error: profileError } = await supabase.from("customer").upsert(
      {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || data.user.email,
        created_at: new Date(),
      },
      { onConflict: ["id"] }
    );

    if (profileError) {
      return res.status(500).json({
        error: "Failed to update user profile",
      });
    }

    res.status(200).json({
      message: "Social login successful",
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name,
      },
      session: data.session,
    });
  } catch (error) {
    res.status(500).json({
      error: "Social login process failed",
      details: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return res.status(500).json({
        error: "Logout failed",
        details: error.message,
      });
    }

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Logout process failed",
      details: error.message,
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { data, error } = await supabaseService.auth.refreshSession();
    if (error || !data || !data.session) {
      console.error("Refresh session error:", error);
      return res.status(401).json({ error: "Invalid refresh token" });
    }
    return res.status(200).json({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    });
  } catch (err) {
    console.error("Error refreshing token:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
