import React, { useEffect, useState } from "react";
import {
  FileInput,
  Title,
  Text,
  Box,
  Image,
  LoadingOverlay,
  Table,
  TextInput,
  List,
  Button,
  Divider,
  NumberInput,
  Group,
} from "@mantine/core";
import {
  DocumentAnalysisClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";
import heic2any from "heic2any";

function ScoreInput({ value, onChange }) {
  return (
    <NumberInput
      value={value}
      onChange={onChange}
      variant="unstyled"
      max={10}
      min={0}
      step={1}
    />
  );
}

function DetailInput({ value, onChange, label }) {
  return (
    <TextInput
      value={value}
      onChange={onChange}
      label={label}
      variant="unstyled"
      size="md"
      styles={{
        label: {
          marginRight: "0.3rem", // Adds space between label and input
          display: "inline-block",
          fontWeight: "normal",
        },
        root: {
          display: "flex",
          alignItems: "center",
        },
        input: {
          flex: 1,
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
  const [extractedData, setExtractedData] = useState(null);
  const [formValues, setFormValues] = useState({
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
      let imageToProcess = file;
      if (
        file.type === "image/heic" ||
        file.name.toLowerCase().endsWith(".heic")
      ) {
        const conversionResult = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        });
        imageToProcess = new File(
          [conversionResult],
          file.name.replace(/\.heic$/i, ".jpg"),
          {
            type: "image/jpeg",
          }
        );
      }

      setSelectedImage(imageToProcess);

      const client = new DocumentAnalysisClient(
        endpoint,
        new AzureKeyCredential(apiKey)
      );

      const arrayBuffer = await file.arrayBuffer();
      const poller = await client.beginAnalyzeDocument(modelId, arrayBuffer);

      const forms = await poller.pollUntilDone();

      console.log(forms);

      if (forms.documents.length > 0) {
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

  return (
    <Box style={{ userSelect: "none", webKitUserSelect: "none" }}>
      <Title order={1}>MockMetrics Ballot Processor</Title>
      <Text>Upload a completed ballot to extract scores</Text>

      <Box pos="relative">
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <FileInput
          accept="image/png, image/jpg, image/jpeg, image/heic"
          label="Upload image"
          placeholder="Select image"
          onChange={handleImageUpload}
          disabled={loading}
          mb="md"
        />
      </Box>

      {error && <Text c="red">{error}</Text>}

      {selectedImage && (
        <Box mb="lg">
          <Image
            src={URL.createObjectURL(selectedImage)}
            alt="Uploaded ballot"
            mah={600}
            w="auto"
            mx="auto"
          />
        </Box>
      )}

      {formValues && (
        <Box mb="xl">
          <Title order={2} mb="md">
            Extracted Data
          </Title>
          <Title order={3} mb="sm">
            Basic Information
          </Title>
          <List mb="sm">
            <List.Item m={0} p={0}>
              <DetailInput
                label="Judge Name:"
                value={formValues.judgeName}
                onChange={(v) =>
                  setFormValues({ ...formValues, judgeName: v.target.value })
                }
              />
            </List.Item>
            <List.Item>
              <DetailInput
                label="Plaintiff/Prosecution Team:"
                value={formValues.pTeam}
                onChange={(v) =>
                  setFormValues({ ...formValues, pTeam: v.target.value })
                }
              />
            </List.Item>
            <List.Item>
              <DetailInput
                label="Defense Team:"
                value={formValues.dTeam}
                onChange={(v) =>
                  setFormValues({ ...formValues, dTeam: v.target.value })
                }
              />
            </List.Item>
          </List>

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
                  <ScoreInput
                    value={formValues.pOpen}
                    onChange={(v) => setFormValues({ ...formValues, pOpen: v })}
                  />
                </Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.dOpen}
                    onChange={(v) => setFormValues({ ...formValues, dOpen: v })}
                  />
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
                  <ScoreInput
                    value={formValues.pDirect1}
                    onChange={(v) =>
                      setFormValues({ ...formValues, pDirect1: v })
                    }
                  />
                </Table.Td>
                <Table.Td>-</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Direct - Witness</Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.pWDirect1}
                    onChange={(v) =>
                      setFormValues({ ...formValues, pWDirect1: v })
                    }
                  />
                </Table.Td>
                <Table.Td>-</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Cross</Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.pWCross1}
                    onChange={(v) =>
                      setFormValues({ ...formValues, pWCross1: v })
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.dCross1}
                    onChange={(v) =>
                      setFormValues({ ...formValues, dCross1: v })
                    }
                  />
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
                  <ScoreInput
                    value={formValues.pDirect2}
                    onChange={(v) =>
                      setFormValues({ ...formValues, pDirect2: v })
                    }
                  />
                </Table.Td>
                <Table.Td>-</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Direct - Witness</Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.pWDirect2}
                    onChange={(v) =>
                      setFormValues({ ...formValues, pWDirect2: v })
                    }
                  />
                </Table.Td>
                <Table.Td>-</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Cross</Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.pWCross2}
                    onChange={(v) =>
                      setFormValues({ ...formValues, pWCross2: v })
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.dCross2}
                    onChange={(v) =>
                      setFormValues({ ...formValues, dCross2: v })
                    }
                  />
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
                  <ScoreInput
                    value={formValues.pDirect3}
                    onChange={(v) =>
                      setFormValues({ ...formValues, pDirect3: v })
                    }
                  />
                </Table.Td>
                <Table.Td>-</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Direct - Witness</Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.pWDirect3}
                    onChange={(v) =>
                      setFormValues({ ...formValues, pWDirect3: v })
                    }
                  />
                </Table.Td>
                <Table.Td>-</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Cross</Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.pWCross3}
                    onChange={(v) =>
                      setFormValues({ ...formValues, pWCross3: v })
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.dCross3}
                    onChange={(v) =>
                      setFormValues({ ...formValues, dCross3: v })
                    }
                  />
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
                  <ScoreInput
                    value={formValues.dDirect1}
                    onChange={(v) =>
                      setFormValues({ ...formValues, dDirect1: v })
                    }
                  />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Direct - Witness</Table.Td>
                <Table.Td>-</Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.dWDirect1}
                    onChange={(v) =>
                      setFormValues({ ...formValues, dWDirect1: v })
                    }
                  />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Cross</Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.pCross1}
                    onChange={(v) =>
                      setFormValues({ ...formValues, pCross1: v })
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.dWCross1}
                    onChange={(v) =>
                      setFormValues({ ...formValues, dWCross1: v })
                    }
                  />
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
                  <ScoreInput
                    value={formValues.dDirect2}
                    onChange={(v) =>
                      setFormValues({ ...formValues, dDirect2: v })
                    }
                  />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Direct - Witness</Table.Td>
                <Table.Td>-</Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.dWDirect2}
                    onChange={(v) =>
                      setFormValues({ ...formValues, dWDirect2: v })
                    }
                  />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Cross</Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.pCross2}
                    onChange={(v) =>
                      setFormValues({ ...formValues, pCross2: v })
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.dWCross2}
                    onChange={(v) =>
                      setFormValues({ ...formValues, dWCross2: v })
                    }
                  />
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
                  <ScoreInput
                    value={formValues.dDirect3}
                    onChange={(v) =>
                      setFormValues({ ...formValues, dDirect3: v })
                    }
                  />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Direct - Witness</Table.Td>
                <Table.Td>-</Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.dWDirect3}
                    onChange={(v) =>
                      setFormValues({ ...formValues, dWDirect3: v })
                    }
                  />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Cross</Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.pCross3}
                    onChange={(v) =>
                      setFormValues({ ...formValues, pCross3: v })
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.dWCross3}
                    onChange={(v) =>
                      setFormValues({ ...formValues, dWCross3: v })
                    }
                  />
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
                  <ScoreInput
                    value={formValues.pClose}
                    onChange={(v) =>
                      setFormValues({ ...formValues, pClose: v })
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <ScoreInput
                    value={formValues.dClose}
                    onChange={(v) =>
                      setFormValues({ ...formValues, dClose: v })
                    }
                  />
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
            </Table.Tfoot>
          </Table>
          {extractedData && (
            <Group>
              <Button onClick={() => console.log(extractedData)}>
                View Raw Data in Console
              </Button>
              <Button onClick={() => setFormValues(extractedData)}>
                Reset to Extracted Data
              </Button>
            </Group>
          )}
        </Box>
      )}
    </Box>
  );
}
