import { useEffect, useState } from "react";
import GavelLoader from "../common/components/loader/GavelLoader";
import {
  FileInput,
  Title,
  Text,
  Box,
  Image,
  Table,
  TextInput,
  Button,
  Divider,
  NumberInput,
  Group,
  Space,
  Overlay,
  Modal,
} from "@mantine/core";
import {
  DocumentAnalysisClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";
import { useSessionStorage } from "@mantine/hooks";
import BasePage from "../common/components/BasePage";

function DetailInput({ value, onChange, label }) {
  return (
    <TextInput
      value={value}
      onChange={onChange}
      label={label}
      mb="xs"
      variant="filled"
      size="md"
      styles={{
        label: {
          marginRight: "0.3rem",
          display: "inline-block",
          fontWeight: "normal",
          width: "30%",
        },
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        },
        wrapper: {
          flex: 1,
          display: "flex",
        },
      }}
    />
  );
}

const formatScore = (scoreStr) => {
  const score = Number(parseInt(scoreStr));
  if (isNaN(score)) return 0;
  if (score < 0) return 0;
  if (score > 10) return 10;
  return score;
};

export default function Test() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedData, setExtractedData] = useSessionStorage({
    key: "ballotExtractedData",
    defaultValue: null,
  });
  const [formValues, setFormValues] = useSessionStorage({
    key: "ballotForm",
    defaultValue: {
      judgeName: "",
      pTeam: "",
      dTeam: "",
      pOpen: 0,
      dOpen: 0,
      pDirect1: 0,
      pDirect2: 0,
      pDirect3: 0,
      dDirect1: 0,
      dDirect2: 0,
      dDirect3: 0,
      pWDirect1: 0,
      pWDirect2: 0,
      pWDirect3: 0,
      dWDirect1: 0,
      dWDirect2: 0,
      dWDirect3: 0,
      pCross1: 0,
      pCross2: 0,
      pCross3: 0,
      dCross1: 0,
      dCross2: 0,
      dCross3: 0,
      pWCross1: 0,
      pWCross2: 0,
      pWCross3: 0,
      dWCross1: 0,
      dWCross2: 0,
      dWCross3: 0,
      pClose: 0,
      dClose: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pTotal, setPTotal] = useState(0);
  const [dTotal, setDTotal] = useState(0);

  const endpoint = import.meta.env.VITE_AZURE_URL;
  const apiKey = import.meta.env.VITE_AZURE_KEY;
  //const modelId = "prebuilt-document";
  const modelId = "mm-test";

  const handleImageUpload = async (file) => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      setSelectedImage(file);

      const client = new DocumentAnalysisClient(
        endpoint,
        new AzureKeyCredential(apiKey)
      );

      const arrayBuffer = await file.arrayBuffer();
      const poller = await client.beginAnalyzeDocument(modelId, arrayBuffer);

      const forms = await poller.pollUntilDone();

      console.log(forms);

      if (forms.documents.length > 0) {
        if (forms.documents[0].confidence < 0.7) {
          throw new Error(
            "Image unable to be processed due to low confidence in results. Please upload a clearer picture and try again. This result may also occur if the image is not of a ballot."
          );
        }
        processFormResults(forms.documents[0]);
      } else {
        throw new Error("No forms were recognized");
      }
    } catch (error) {
      setError(`Error processing ballot: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const processFormResults = (form) => {
    const result = {
      judgeName: form.fields["Judge Name"]?.value || "",
      pTeam: form.fields["P Team"]?.value || "",
      dTeam: form.fields["D Team"]?.value || "",
      pOpen: formatScore(form.fields["P Opening"]?.value) || 0,
      dOpen: formatScore(form.fields["D Opening"]?.value) || 0,
      pDirect1: formatScore(form.fields["P Direct #1"]?.value) || 0,
      pDirect2: formatScore(form.fields["P Direct #2"]?.value) || 0,
      pDirect3: formatScore(form.fields["P Direct #3"]?.value) || 0,
      dDirect1: formatScore(form.fields["D Direct #1"]?.value) || 0,
      dDirect2: formatScore(form.fields["D Direct #2"]?.value) || 0,
      dDirect3: formatScore(form.fields["D Direct #3"]?.value) || 0,
      pWDirect1: formatScore(form.fields["P Direct W #1"]?.value) || 0,
      pWDirect2: formatScore(form.fields["P Direct W #2"]?.value) || 0,
      pWDirect3: formatScore(form.fields["P Direct W #3"]?.value) || 0,
      dWDirect1: formatScore(form.fields["D Direct W #1"]?.value) || 0,
      dWDirect2: formatScore(form.fields["D Direct W #2"]?.value) || 0,
      dWDirect3: formatScore(form.fields["D Direct W #3"]?.value) || 0,
      pCross1: formatScore(form.fields["P Cross #1"]?.value) || 0,
      pCross2: formatScore(form.fields["P Cross #2"]?.value) || 0,
      pCross3: formatScore(form.fields["P Cross #3"]?.value) || 0,
      dCross1: formatScore(form.fields["D Cross #1"]?.value) || 0,
      dCross2: formatScore(form.fields["D Cross #2"]?.value) || 0,
      dCross3: formatScore(form.fields["D Cross #3"]?.value) || 0,
      pWCross1: formatScore(form.fields["P Cross W #1"]?.value) || 0,
      pWCross2: formatScore(form.fields["P Cross W #2"]?.value) || 0,
      pWCross3: formatScore(form.fields["P Cross W #3"]?.value) || 0,
      dWCross1: formatScore(form.fields["D Cross W #1"]?.value) || 0,
      dWCross2: formatScore(form.fields["D Cross W #2"]?.value) || 0,
      dWCross3: formatScore(form.fields["D Cross W #3"]?.value) || 0,
      pClose: formatScore(form.fields["P Closing"]?.value) || 0,
      dClose: formatScore(form.fields["D Closing"]?.value) || 0,
    };

    setExtractedData(result);
  };

  useEffect(() => {
    if (!formValues) return;

    const pTotal =
      formValues.pOpen +
      formValues.pDirect1 +
      formValues.pDirect2 +
      formValues.pDirect3 +
      formValues.pWDirect1 +
      formValues.pWDirect2 +
      formValues.pWDirect3 +
      formValues.pCross1 +
      formValues.pCross2 +
      formValues.pCross3 +
      formValues.pWCross1 +
      formValues.pWCross2 +
      formValues.pWCross3 +
      formValues.pClose;

    const dTotal =
      formValues.dOpen +
      formValues.dDirect1 +
      formValues.dDirect2 +
      formValues.dDirect3 +
      formValues.dWDirect1 +
      formValues.dWDirect2 +
      formValues.dWDirect3 +
      formValues.dCross1 +
      formValues.dCross2 +
      formValues.dCross3 +
      formValues.dWCross1 +
      formValues.dWCross2 +
      formValues.dWCross3 +
      formValues.dClose;

    setPTotal(pTotal);
    setDTotal(dTotal);
  }, [formValues]);

  useEffect(() => {
    setFormValues({
      judgeName: extractedData?.judgeName || "",
      pTeam: extractedData?.pTeam || "",
      dTeam: extractedData?.dTeam || "",
      pOpen: extractedData?.pOpen || 0,
      dOpen: extractedData?.dOpen || 0,
      pDirect1: extractedData?.pDirect1 || 0,
      pDirect2: extractedData?.pDirect2 || 0,
      pDirect3: extractedData?.pDirect3 || 0,
      dDirect1: extractedData?.dDirect1 || 0,
      dDirect2: extractedData?.dDirect2 || 0,
      dDirect3: extractedData?.dDirect3 || 0,
      pWDirect1: extractedData?.pWDirect1 || 0,
      pWDirect2: extractedData?.pWDirect2 || 0,
      pWDirect3: extractedData?.pWDirect3 || 0,
      dWDirect1: extractedData?.dWDirect1 || 0,
      dWDirect2: extractedData?.dWDirect2 || 0,
      dWDirect3: extractedData?.dWDirect3 || 0,
      pCross1: extractedData?.pCross1 || 0,
      pCross2: extractedData?.pCross2 || 0,
      pCross3: extractedData?.pCross3 || 0,
      dCross1: extractedData?.dCross1 || 0,
      dCross2: extractedData?.dCross2 || 0,
      dCross3: extractedData?.dCross3 || 0,
      pWCross1: extractedData?.pWCross1 || 0,
      pWCross2: extractedData?.pWCross2 || 0,
      pWCross3: extractedData?.pWCross3 || 0,
      dWCross1: extractedData?.dWCross1 || 0,
      dWCross2: extractedData?.dWCross2 || 0,
      dWCross3: extractedData?.dWCross3 || 0,
      pClose: extractedData?.pClose || 0,
      dClose: extractedData?.dClose || 0,
    });
  }, [extractedData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (loading) {
      window.addEventListener("keydown", handleKeyDown, true);
      window.addEventListener("keyup", handleKeyDown, true);
      window.addEventListener("keypress", handleKeyDown, true);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyDown, true);
      window.removeEventListener("keypress", handleKeyDown, true);
    };
  }, [loading]);

  const ScoreInput = ({ val }) => {
    return (
      <NumberInput
        value={formValues[val]}
        onChange={(v) =>
          setFormValues({ ...formValues, [val]: formatScore(v) })
        }
        variant="unstyled"
        max={10}
        min={0}
        step={1}
      />
    );
  };

  const [modalOpened, setModalOpend] = useState(false);

  return (
    <BasePage
      titleText="MockMetrics Ballot Processor"
      styleProps={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      <Text>Upload a completed ballot to extract scores</Text>
      <Text fz="xs">
        This process is AI-assisted, but no data is stored after being
        processed.
      </Text>
      <Text fz="xs">
        Extracted numbers may be incorrect. Please verify against your copy of
        the ballot and adjust where necessary.
      </Text>
      <Space h="xs" />

      {loading && (
        <Overlay
          fixed={true}
          blur={2}
          color="#fff"
          backgroundOpacity={0.25}
          aria-label="Processing ballot, please wait"
        >
          <GavelLoader />
        </Overlay>
      )}

      <Box pos="relative" mb="lg">
        <FileInput
          accept="image/png, image/jpg, image/jpeg"
          label="Upload image"
          placeholder="Select image"
          onChange={handleImageUpload}
          disabled={loading}
          mb="md"
        />
        {error && (
          <Text c="red" mb="lg">
            {error}
          </Text>
        )}
        {selectedImage && !error && (
          <Image
            src={URL.createObjectURL(selectedImage)}
            alt="Uploaded ballot"
            mah="50vh"
            maw="100%"
            w="auto"
            mx="auto"
          />
        )}
        {formValues && (
          <Box mb="xl">
            <Title order={2} mb="md">
              {extractedData && "Extracted Data"}
            </Title>
            <Title order={3} mb="sm">
              Basic Information
            </Title>
            <Box mb="sm" w="100%">
              <DetailInput
                label="Judge Name:"
                value={formValues.judgeName}
                onChange={(v) =>
                  setFormValues({ ...formValues, judgeName: v.target.value })
                }
              />
              <DetailInput
                label="P Team:"
                value={formValues.pTeam}
                onChange={(v) =>
                  setFormValues({ ...formValues, pTeam: v.target.value })
                }
              />
              <DetailInput
                label="D Team:"
                value={formValues.dTeam}
                onChange={(v) =>
                  setFormValues({ ...formValues, dTeam: v.target.value })
                }
              />
            </Box>

            <Title order={3} mb="sm">
              Scores
            </Title>
            <Table
              striped
              mb="lg"
              withTableBorder
              size="xs"
              fz="xs"
              verticalSpacing={5}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Td>
                    <b>Score Type</b>
                  </Table.Td>
                  <Table.Td>
                    <b>P Team Score</b>
                  </Table.Td>
                  <Table.Td>
                    <b>D Team Score</b>
                  </Table.Td>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>Opening</Table.Td>
                  <Table.Td>
                    <ScoreInput val="pOpen" />
                  </Table.Td>
                  <Table.Td>
                    <ScoreInput val="dOpen" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Divider />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <em>P Witness #1</em>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Attorney</Table.Td>
                  <Table.Td>
                    <ScoreInput val="pDirect1" />
                  </Table.Td>
                  <Table.Td>-</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Witness</Table.Td>
                  <Table.Td>
                    <ScoreInput val="pWDirect1" />
                  </Table.Td>
                  <Table.Td>-</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Cross</Table.Td>
                  <Table.Td>
                    <ScoreInput val="pWCross1" />
                  </Table.Td>
                  <Table.Td>
                    <ScoreInput val="dCross1" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <em>P Witness #2</em>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Attorney</Table.Td>
                  <Table.Td>
                    <ScoreInput val="pDirect2" />
                  </Table.Td>
                  <Table.Td>-</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Witness</Table.Td>
                  <Table.Td>
                    <ScoreInput val="pWDirect2" />
                  </Table.Td>
                  <Table.Td>-</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Cross</Table.Td>
                  <Table.Td>
                    <ScoreInput val="pWCross2" />
                  </Table.Td>
                  <Table.Td>
                    <ScoreInput val="dCross2" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <em>P Witness #3</em>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Attorney</Table.Td>
                  <Table.Td>
                    <ScoreInput val="pDirect3" />
                  </Table.Td>
                  <Table.Td>-</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Witness</Table.Td>
                  <Table.Td>
                    <ScoreInput val="pWDirect3" />
                  </Table.Td>
                  <Table.Td>-</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Cross</Table.Td>
                  <Table.Td>
                    <ScoreInput val="pWCross3" />
                  </Table.Td>
                  <Table.Td>
                    <ScoreInput val="dCross3" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Divider />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <em>D Witness #1</em>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Attorney</Table.Td>
                  <Table.Td>-</Table.Td>
                  <Table.Td>
                    <ScoreInput val="dDirect1" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Witness</Table.Td>
                  <Table.Td>-</Table.Td>
                  <Table.Td>
                    <ScoreInput val="dWDirect1" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Cross</Table.Td>
                  <Table.Td>
                    <ScoreInput val="pCross1" />
                  </Table.Td>
                  <Table.Td>
                    <ScoreInput val="dWCross1" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <em>D Witness #2</em>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Attorney</Table.Td>
                  <Table.Td>-</Table.Td>
                  <Table.Td>
                    <ScoreInput val="dDirect2" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Witness</Table.Td>
                  <Table.Td>-</Table.Td>
                  <Table.Td>
                    <ScoreInput val="dWDirect2" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Cross</Table.Td>
                  <Table.Td>
                    <ScoreInput val="pCross2" />
                  </Table.Td>
                  <Table.Td>
                    <ScoreInput val="dWCross2" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <em>D Witness #3</em>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Attorney</Table.Td>
                  <Table.Td>-</Table.Td>
                  <Table.Td>
                    <ScoreInput val="dDirect3" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Witness</Table.Td>
                  <Table.Td>-</Table.Td>
                  <Table.Td>
                    <ScoreInput val="dWDirect3" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Cross</Table.Td>
                  <Table.Td>
                    <ScoreInput val="pCross3" />
                  </Table.Td>
                  <Table.Td>
                    <ScoreInput val="dWCross3" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Divider />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Closing</Table.Td>
                  <Table.Td>
                    <ScoreInput val="pClose" />
                  </Table.Td>
                  <Table.Td>
                    <ScoreInput val="dClose" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Divider />
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
              <Table.Tfoot>
                <Table.Tr>
                  <Table.Td>
                    <b>Total</b>
                  </Table.Td>
                  <Table.Td>
                    {pTotal} (-{140 - pTotal})
                  </Table.Td>
                  <Table.Td>
                    {dTotal} (-{140 - dTotal})
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>
                    <b>Result</b>
                  </Table.Td>
                  <Table.Td>
                    {pTotal == dTotal
                      ? "Tie"
                      : pTotal > dTotal
                      ? `Win (+${pTotal - dTotal})`
                      : `Loss (-${dTotal - pTotal})`}
                  </Table.Td>
                  <Table.Td>
                    {dTotal == pTotal
                      ? "Tie"
                      : dTotal > pTotal
                      ? `Win (+${dTotal - pTotal})`
                      : `Loss (-${pTotal - dTotal})`}
                  </Table.Td>
                </Table.Tr>
              </Table.Tfoot>
            </Table>
            {extractedData && (
              <>
                <Group>
                  <Button onClick={() => console.log(extractedData)}>
                    View Raw Data in Console
                  </Button>
                  <Button onClick={() => setFormValues(extractedData)}>
                    Reset to Extracted Data
                  </Button>
                </Group>
                <Space h="xs" />
              </>
            )}
            <Button
              onClick={() => {
                setExtractedData(null);
                setSelectedImage(null);
              }}
            >
              Reset to Default
            </Button>
          </Box>
        )}
      </Box>
    </BasePage>
  );
}
