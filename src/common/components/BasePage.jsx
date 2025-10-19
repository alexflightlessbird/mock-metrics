import {
  Container,
  Title,
  Space,
  ActionIcon,
  Affix,
  Group,
  TextInput,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { LuPencil, LuSave } from "react-icons/lu";

export default function BasePage({
  titleText,
  children,
  centerTitle = false,
  styleProps = {},
  editEnabled = false,
  editMode = false,
  setEditMode,
  onSave,
  editableTitle = false,
}) {
  const [currentTitle, setCurrentTitle] = useState(titleText);

  useEffect(() => {
    setCurrentTitle(titleText);
  }, [titleText]);

  return (
    <Container fluid style={{ ...styleProps }}>
      {editEnabled && (
        <Affix position={{ bottom: 20, right: 20 }}>
          <ActionIcon
            radius="xl"
            size="xl"
            onClick={() => {
              if (editMode && onSave) {
                onSave({ title: currentTitle });
              } else {
                setEditMode(!editMode);
              }
            }}
          >
            {editMode ? <LuSave /> : <LuPencil />}
          </ActionIcon>
        </Affix>
      )}

      <Group>
        <Title
          order={1}
          style={{
            textAlign: centerTitle ? "center" : "",
            justifySelf: centerTitle ? "center" : "",
          }}
        >
          {editableTitle && editEnabled && editMode && (
            <TextInput
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              style={{
                fontSize: "1.875rem",
                fontWeight: 700,
                lineHeight: 1.2,
                border: "none",
                borderBottom: "2px solid #000",
                outline: "none",
                marginRight: "10px",
              }}
            />
          )}
          {!(editableTitle && editEnabled && editMode) && currentTitle}
        </Title>
      </Group>
      <Space h="md" />

      {children}
    </Container>
  );
}
