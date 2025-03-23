import React, { lazy, Suspense, useState } from "react";
import Spin from "antd/es/spin";
import Button from "antd/es/button";
import notification from "antd/es/notification";
import message from "antd/es/message";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { setDocumentTitle } from "../utils/helpers";
import { useSession } from "../hooks/auth/useSession";

const Modal = lazy(() => import("../components/paginating-forms/Modal"));
const IconButton = lazy(() =>
  import("../components/common/buttons/IconButton")
);

export default function Login() {
  const { session } = useSession();
  const navigate = useNavigate();

  if (session) {
    const [loggingOut, setLoggingOut] = useState(false);

    setDocumentTitle({ title: "Logout" });

    const handleLogout = async () => {
      setLoggingOut(true);
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
        setLoggingOut(false);
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        setLoggingOut(false);
      }
    };

    return (
      <>
        {loggingOut && (
          <Spin
            fullscreen
            delay={500}
            tip={
              <>
                <p>
                  logging you out...
                  <br />
                  see you next time!
                </p>
              </>
            }
          />
        )}
        <div className="testing">
          <h1>Logout Page</h1>
          <Button
            className="logout-button"
            type="primary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </>
    );
  }

  if (!session) {
    const [loggingIn, setLoggingIn] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isModalLoaded, setIsModalLoaded] = useState(false);
    const [notificationApi, notificationContextHolder] =
      notification.useNotification();
    const [messageApi, messageContextHolder] = message.useMessage();

    const handleLogin = async ({ email, password }) => {
      setIsOpen(false);
      setLoggingIn(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          if (error.message === "Invalid login credentials") {
            setLoggingIn(false);
            setIsOpen(true);
            return showErrorMessage({ error: "invalid" });
          }
          return showErrorMessage({ error: "other" });
        }
        setLoggingIn(false);
        showConfirmationMessage();
        navigate("/settings", { replace: true });
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setLoggingIn(false);
      }
    };

    function handleOpenModal() {
      setIsOpen(true);
      setIsModalLoaded(true);
    }

    function handleCloseModal() {
      setIsOpen(false);
    }

    setDocumentTitle({ title: "Login" });

    function showConfirmationMessage() {
      messageApi.open({
        type: "success",
        content: "Login successful",
      });
    }

    function showErrorMessage({ error }) {
      if (error === "invalid") {
        messageApi.open({
          type: "error",
          content: "Incorrect email or password",
        });
      } else {
        messageApi.open({
          type: "error",
          content: `Login failed, please try again`,
        });
      }
    }

    const formQuestions = {
      title: "Login",
      className: "login-form",
      fieldsetGroups: [
        [
          {
            title: "",
            formGroups: [
              [
                {
                  title: "",
                  waitTime: 15,
                  disableAfterCompletion: false,
                  onSubmit: (values) => handleLogin(values),
                  showMessage: false,
                  showSubmit: false,
                  inputGroups: [
                    [
                      {
                        name: "email",
                        type: "email",
                        label: "Email",
                        required: true,
                        placeholder: "Enter your email",
                        rules: [
                          {
                            pattern:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Please input a valid email",
                          },
                        ],
                      },
                      {
                        name: "password",
                        type: "password",
                        label: "Password",
                        required: true,
                        placeholder: "Enter your password",
                        rules: [
                          {
                            min: 6,
                            message: "Password is at least 6 characters",
                          },
                        ],
                      },
                    ],
                  ],
                },
              ],
            ],
          },
        ],
      ],
    };

    return (
      <>
        {notificationContextHolder}
        {messageContextHolder}
        {loggingIn && (
          <Spin
            fullscreen
            delay={500}
            tip={
              <>
                <p>
                  logging you in...
                  <br />
                  welcome back!
                </p>
              </>
            }
          />
        )}
        <div className="testing">
          <h1>Login Page</h1>
          <Suspense
            fallback={<Button className="open-modal" loading disabled />}
          >
            <IconButton
              buttonText="Login"
              icon="login"
              onClick={handleOpenModal}
              className="open-modal"
            />
          </Suspense>
          {isModalLoaded && isOpen && (
            <Suspense
              fallback={<Spin fullscreen delay={500} tip="loading modal" />}
            >
              <Modal
                {...formQuestions}
                isOpen={isOpen}
                onClose={handleCloseModal}
              />
            </Suspense>
          )}
        </div>
      </>
    );
  }
}
