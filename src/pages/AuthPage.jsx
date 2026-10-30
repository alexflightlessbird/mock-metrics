import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  PasswordInput,
  PinInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { LuCircle, LuCircleCheck } from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/svgs/Logo/Logo";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const existingAccountError =
  "An account with this email already exists. Sign in or reset your password.";
const passwordRequirementsError = "Please meet all password requirements.";
const errorDismissDelay = 8000;

const passwordRules = [
  { label: "At least 8 characters", validate: (password) => password.length >= 8 },
  { label: "At least one lowercase letter", validate: (password) => /[a-z]/.test(password) },
  { label: "At least one uppercase letter", validate: (password) => /[A-Z]/.test(password) },
  { label: "At least one number", validate: (password) => /\d/.test(password) },
];

function isValidPassword(password) {
  return passwordRules.every(({ validate }) => validate(password));
}

function PasswordRequirements({ password }) {
  return (
    <Stack gap={4} mt="xs" role="list" aria-label="Password requirements">
      {passwordRules.map(({ label, validate }) => {
        const isMet = validate(password);
        const RequirementIcon = isMet ? LuCircleCheck : LuCircle;

        return (
          <Group
            key={label}
            gap="xs"
            wrap="nowrap"
            role="listitem"
            aria-label={`${label}: ${isMet ? "met" : "not met"}`}
          >
            <RequirementIcon
              size={14}
              color={
                isMet
                  ? "var(--mantine-color-teal-6)"
                  : "var(--mantine-color-dimmed)"
              }
              aria-hidden="true"
            />
            <Text size="xs" c={isMet ? "teal" : "dimmed"}>
              {label}
            </Text>
          </Group>
        );
      })}
    </Stack>
  );
}

export default function AuthPage() {
  const { isDark } = useTheme();
  const {
    signIn,
    signUp,
    verifyEmailOtp,
    resendEmailOtp,
    requestPasswordReset,
    verifyPasswordResetOtp,
    updatePassword,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialStep =
    location.pathname === "/signup"
      ? "signup"
      : location.pathname === "/forgot-password"
        ? "request-reset"
        : "login";
  const [step, setStep] = useState(initialStep);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const changeStep = (nextStep) => {
    setError("");
    setMessage("");
    setToken("");
    setStep(nextStep);
  };

  useEffect(() => {
    setStep(initialStep);
    setError("");
    setMessage("");
  }, [initialStep]);

  useEffect(() => {
    if (!error) return undefined;

    const timeoutId = window.setTimeout(() => setError(""), errorDismissDelay);
    return () => window.clearTimeout(timeoutId);
  }, [error]);

  const runAuthAction = async (action) => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await action();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    runAuthAction(async () => {
      await signIn(email, password);
      navigate("/", { replace: true });
    });
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    runAuthAction(async () => {
      const data = await signUp(email, password);
      if (data.user?.identities?.length === 0) {
        setError(existingAccountError);
        return;
      }

      if (data.session) {
        navigate("/", { replace: true });
      } else {
        changeStep("verify-signup");
        setMessage("Enter the six-digit code we sent to your email.");
      }
    });
  };

  const handleRequestReset = (event) => {
    event.preventDefault();
    runAuthAction(async () => {
      await requestPasswordReset(email);
      changeStep("verify-recovery");
      setMessage(
        "If an account exists for this email, you'll receive a six-digit reset code.",
      );
    });
  };

  const handleVerifyCode = (event) => {
    event.preventDefault();
    if (token.length !== 6) {
      setError("Enter the complete six-digit code.");
      return;
    }

    runAuthAction(async () => {
      if (step === "verify-signup") {
        await verifyEmailOtp(email, token);
        navigate("/", { replace: true });
        return;
      }

      await verifyPasswordResetOtp(email, token);
      changeStep("new-password");
      setMessage("Your email is verified. Choose a new password.");
    });
  };

  const handleResendCode = () => {
    runAuthAction(async () => {
      if (step === "verify-signup") {
        await resendEmailOtp(email);
      } else {
        await requestPasswordReset(email);
      }
      setMessage(
        step === "verify-signup"
          ? "A new code has been sent to your email."
          : "If an account exists for this email, a new reset code will be sent.",
      );
    });
  };

  const handleUpdatePassword = (event) => {
    event.preventDefault();
    if (!isValidPassword(password)) {
      setError(passwordRequirementsError);
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    runAuthAction(async () => {
      await updatePassword(password);
      navigate("/", { replace: true });
    });
  };

  const isSignup = step === "signup";
  const isResetRequest = step === "request-reset";
  const isCodeStep = step === "verify-signup" || step === "verify-recovery";
  const title = {
    login: "Welcome back",
    signup: "Create your account",
    "request-reset": "Reset your password",
    "verify-signup": "Verify your email",
    "verify-recovery": "Confirm password reset",
    "new-password": "Choose a new password",
  }[step];

  return (
    <Box mih="100vh" style={{ display: "flex", flexDirection: "column" }}>
      <Center px="md" py="xl" style={{ flex: 1 }}>
        <Container size={440} w="100%">
          <Stack align="center" gap="md" mb="xl">
            <Box w={100} h={100}>
              <Logo />
            </Box>
            <Text
              ff="Trirong"
              fw={700}
              fz={28}
              c={isDark ? "var(--mantine-color-text)" : "#0a1f3c"}
            >
              MockMetrics
            </Text>
          </Stack>

          <Paper withBorder shadow="md" radius="md" p={{ base: "lg", sm: "xl" }}>
            <Stack gap="lg">
            <div>
              <Title
                order={2}
                ta="center"
                c={isDark ? "var(--mantine-color-text)" : "#0a1f3c"}
              >
                {title}
              </Title>
              <Text c="dimmed" size="sm" ta="center" mt="xs">
                {isCodeStep
                  ? step === "verify-signup"
                    ? `We sent a six-digit code to ${email}.`
                    : `If an account exists for ${email}, a six-digit reset code will be sent.`
                  : step === "new-password"
                    ? "Use a password you have not used before."
                    : isResetRequest
                      ? "Enter the email address linked to your account."
                      : isSignup
                        ? "Sign up to start using MockMetrics."
                        : "Sign in to continue to MockMetrics."}
              </Text>
            </div>

            {step === "login" && (
              <form onSubmit={handleSignIn}>
                <Stack>
                  <TextInput
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    required
                  />
                  <PasswordInput
                    label="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    required
                  />
                  <Group justify="flex-end">
                    <Anchor
                      component={Link}
                      to="/forgot-password"
                      size="sm"
                      onClick={() => changeStep("request-reset")}
                    >
                      Forgot password?
                    </Anchor>
                  </Group>
                  <Button type="submit" loading={loading} fullWidth>
                    Sign in
                  </Button>
                </Stack>
              </form>
            )}

            {step === "signup" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!isValidPassword(password)) {
                    setError(passwordRequirementsError);
                    return;
                  }
                  handleSignUp(event);
                }}
              >
                <Stack>
                  <TextInput
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    required
                  />
                  <PasswordInput
                    label="Password"
                    autoComplete="new-password"
                    description={<PasswordRequirements password={password} />}
                    descriptionProps={{ component: "div" }}
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    required
                  />
                  <Button type="submit" loading={loading} fullWidth>
                    Create account
                  </Button>
                </Stack>
              </form>
            )}

            {isResetRequest && (
              <form onSubmit={handleRequestReset}>
                <Stack>
                  <TextInput
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    required
                  />
                  <Button type="submit" loading={loading} fullWidth>
                    Send reset code
                  </Button>
                </Stack>
              </form>
            )}

            {isCodeStep && (
              <form onSubmit={handleVerifyCode}>
                <Stack align="center">
                  <PinInput
                    length={6}
                    type="number"
                    value={token}
                    onChange={setToken}
                    aria-label="Six-digit email verification code"
                    autoFocus
                  />
                  <Button type="submit" loading={loading} fullWidth>
                    Verify code
                  </Button>
                  <Button
                    type="button"
                    variant="subtle"
                    onClick={handleResendCode}
                    loading={loading}
                  >
                    Resend code
                  </Button>
                </Stack>
              </form>
            )}

            {step === "new-password" && (
              <form onSubmit={handleUpdatePassword}>
                <Stack>
                  <PasswordInput
                    label="New password"
                    autoComplete="new-password"
                    description={<PasswordRequirements password={password} />}
                    descriptionProps={{ component: "div" }}
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    required
                  />
                  <PasswordInput
                    label="Confirm new password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.currentTarget.value)
                    }
                    required
                  />
                  <Button type="submit" loading={loading} fullWidth>
                    Update password
                  </Button>
                </Stack>
              </form>
            )}

            {error === existingAccountError && (
              <Text c="red" size="sm" role="alert">
                An account with this email already exists.{" "}
                <Anchor component={Link} to="/auth">
                  Sign in
                </Anchor>{" "}
                or{" "}
                <Anchor component={Link} to="/forgot-password">
                  reset your password
                </Anchor>
                .
              </Text>
            )}
            {error && error === "Signups not allowed for this instance" && (
              <Text c="red" size="sm" role="alert">
                Signups are currently disabled. Please contact the administrator
                for assistance.
              </Text>
            )}
            {error && error === "Invalid login credentials" && (
              <Text c="red" size="sm" role="alert">
                Invalid email or password. Please try again.
              </Text>
            )}
            {error &&
              error !== existingAccountError &&
              error !== "Signups not allowed for this instance" &&
              error !== "Invalid login credentials" && (
                <Text c="red" size="sm" role="alert">
                  {error}
                </Text>
              )}
            {message && (
              <Text c="green" size="sm" role="status">
                {message}
              </Text>
            )}

            {step === "signup" && (
              <Text size="sm" ta="center">
                Already have an account?{" "}
                <Anchor
                  component={Link}
                  to="/auth"
                  onClick={() => changeStep("login")}
                >
                  Sign in
                </Anchor>
              </Text>
            )}
            {step === "login" && (
              <Text size="sm" ta="center">
                New to MockMetrics?{" "}
                <Anchor
                  component={Link}
                  to="/signup"
                  onClick={() => changeStep("signup")}
                >
                  Create an account
                </Anchor>
              </Text>
            )}
            {(isResetRequest || isCodeStep || step === "new-password") && (
              <Text size="sm" ta="center">
                <Anchor
                  component={Link}
                  to="/auth"
                  onClick={() => changeStep("login")}
                >
                  Back to sign in
                </Anchor>
              </Text>
            )}
            </Stack>
          </Paper>
        </Container>
      </Center>
    </Box>
  );
}
