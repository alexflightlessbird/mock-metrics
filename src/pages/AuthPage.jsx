import {
  TextInput,
  PasswordInput,
  Button,
  Space,
  Text,
  Center,
} from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BasePage from "../common/components/BasePage";

export default function AuthPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center maw="100vw" h="100vh" mr="xl" ml="xl">
      <BasePage titleText="Sign In" centerTitle styleProps={{ width: "100%" }}>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Text c="red">{error}</Text>}
          <Space h="md" />
          <Button type="submit" loading={loading}>
            Sign In
          </Button>
        </form>
      </BasePage>
    </Center>
  );
}
