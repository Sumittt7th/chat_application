import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, TextField, Typography, Paper, Box, Link } from "@mui/material";
import { useMutation } from "@apollo/client";
import { CREATE_USER, LOGIN } from "../../graphql/user.mutation";  // Import the GraphQL mutations
import { saveTokens } from "../../utils/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
  name?: string; // Used for signup
}

/**
 * AuthPage component is responsible for handling the authentication flow of users, including login and signup.
 * It displays a form that switches between login and signup modes based on user interaction.
 * 
 * @returns {JSX.Element} - The rendered authentication page JSX.
 */
const AuthPage: React.FC = () => {
  const [activeForm, setActiveForm] = useState<"login" | "signup">("login");
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormData>();

  // Apollo Client useMutation hooks
  const [createUser] = useMutation(CREATE_USER); // Mutation for creating a new user
  const [login] = useMutation(LOGIN); // Mutation for logging in the user

  // Form submission handler for both login and signup
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (activeForm === "login") {
      try {
        // Call the login mutation
        const { data: loginData } = await login({
          variables: {
            email: data.email,
            password: data.password,
          },
        });

        // Save tokens in the local storage or state management
        const { accessToken, refreshToken, user } = loginData.login;
        saveTokens(accessToken, refreshToken, user.role);

        toast.success("Login Successful");
        navigate("/dashboard"); // Redirect to the dashboard
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("Login failed. Please try again.");
      }
    } else if (activeForm === "signup") {
      try {
        // Call the create user mutation
        await createUser({
          variables: {
            name: data.name!,
            email: data.email,
            password: data.password,
          },
        });

        toast.success("Signup Successful. Please login.");
        setActiveForm("login"); // Switch to the login form after successful signup
      } catch (error) {
        console.error("Signup failed:", error);
        toast.error("Signup failed. Please try again.");
      }
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        maxWidth: 400,
        margin: "2rem auto",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        {activeForm === "login" ? "Login" : "Sign Up"}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name field appears only on signup */}
        {activeForm === "signup" && (
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register("name")}
          />
        )}

        {/* Common fields for both login and signup */}
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register("email")}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("password")}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {activeForm === "login" ? "Login" : "Sign Up"}
        </Button>
      </form>

      <Box mt={2}>
        {/* Show toggle options based on the active form */}
        {activeForm === "login" && (
          <>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                component="button"
                onClick={() => setActiveForm("signup")}
                sx={{ textDecoration: "none", fontWeight: "bold" }}
              >
                Sign Up
              </Link>
            </Typography>
            <Typography variant="body2" mt={1}>
              <Link
                component="button"
                onClick={() => navigate("/forgot-password")}
                sx={{ textDecoration: "none", fontWeight: "bold" }}
              >
                Forgot Password?
              </Link>
            </Typography>
          </>
        )}
        {activeForm === "signup" && (
          <Typography variant="body2">
            Already have an account?{" "}
            <Link
              component="button"
              onClick={() => setActiveForm("login")}
              sx={{ textDecoration: "none", fontWeight: "bold" }}
            >
              Login
            </Link>
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default AuthPage;
