import { useState } from "react";
import { FileInput, Title, Text, Box, Image, LoadingOverlay, Table, TextInput, List, Button } from "@mantine/core";
import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";

export default function Test() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const endpoint = import.meta.env.VITE_AZURE_URL;
    const apiKey = import.meta.env.VITE_AZURE_KEY;
    //const modelId = "prebuilt-document";
    const modelId = "mm-test";

    const handleImageUpload = async (file) => {
        if (!file) return;

        setSelectedImage(file);
        setLoading(true);
        setError(null);

        try {
            const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

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
            setLoading(false)
        }
    }

    const processFormResults = (form) => {
        const result = {
            judgeName: form.fields["Judge Name"]?.value || "",
            pTeam: form.fields["P Team"]?.value || "",
            dTeam: form.fields["D Team"]?.value || "",
            pOpen: form.fields["P Opening"]?.value || "",
            dOpen: form.fields["D Opening"]?.value || "",
            pDirect1: form.fields["P Direct #1"]?.value || "",
            pDirect2: form.fields["P Direct #2"]?.value || "",
            pDirect3: form.fields["P Direct #3"]?.value || "",
            dDirect1: form.fields["D Direct #1"]?.value || "",
            dDirect2: form.fields["D Direct #2"]?.value || "",
            dDirect3: form.fields["D Direct #3"]?.value || "",
            pWDirect1: form.fields["P Direct W #1"]?.value || "",
            pWDirect2: form.fields["P Direct W #2"]?.value || "",
            pWDirect3: form.fields["P Direct W #3"]?.value || "",
            dWDirect1: form.fields["D Direct W #1"]?.value || "",
            dWDirect2: form.fields["D Direct W #2"]?.value || "",
            dWDirect3: form.fields["D Direct W #3"]?.value || "",
            pCross1: form.fields["P Cross #1"]?.value || "",
            pCross2: form.fields["P Cross #2"]?.value || "",
            pCross3: form.fields["P Cross #3"]?.value || "",
            dCross1: form.fields["D Cross #1"]?.value || "",
            dCross2: form.fields["D Cross #2"]?.value || "",
            dCross3: form.fields["D Cross #3"]?.value || "",
            pWCross1: form.fields["P Cross W #1"]?.value || "",
            pWCross2: form.fields["P Cross W #2"]?.value || "",
            pWCross3: form.fields["P Cross W #3"]?.value || "",
            dWCross1: form.fields["D Cross W #1"]?.value || "",
            dWCross2: form.fields["D Cross W #2"]?.value || "",
            dWCross3: form.fields["D Cross W #3"]?.value || "",
            pClose: form.fields["P Closing"]?.value || "",
            dClose: form.fields["D Closing"]?.value || ""
        };

        setExtractedData(result);
    }

    return (
        <>
            <Title order={1}>MockMetrics Ballot Processor</Title>
            <Text>Upload a completed ballot to extract scores</Text>

            <Box pos="relative">
                <LoadingOverlay visible={loading} overlayBlur={2} />
                <FileInput 
                    accept="image/png, image/jpg, image/jpeg" 
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

            {extractedData && (
                <Box mb="xl">
                    <Title order={2} mb="md">Extracted Data</Title>
                    <Title order={3} mb="sm">Basic Information</Title>
                    <List>
                        <List.Item>Judge Name: {extractedData.judgeName}</List.Item>
                        <List.Item>Plaintiff/Prosecution Team: {extractedData.pTeam}</List.Item>
                        <List.Item>Defense Team: {extractedData.dTeam}</List.Item>
                    </List>

                    <Title order={3} mb="sm">Scores</Title>
                    <Table striped mb="lg" withTableBorder>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Td><b>Score Type</b></Table.Td>
                                <Table.Td><b>P Team Score</b></Table.Td>
                                <Table.Td><b>D Team Score</b></Table.Td>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td>Opening</Table.Td>
                                <Table.Td>{extractedData.pOpen}</Table.Td>
                                <Table.Td>{extractedData.dOpen}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>Direct #1 (Attorney)</Table.Td>
                                <Table.Td>{extractedData.pDirect1}</Table.Td>
                                <Table.Td>{extractedData.dDirect1}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>Direct #1 (Witness)</Table.Td>
                                <Table.Td>{extractedData.pWDirect1}</Table.Td>
                                <Table.Td>{extractedData.dWDirect1}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>Cross #1 (Witness)</Table.Td>
                                <Table.Td>{extractedData.pWCross1}</Table.Td>
                                <Table.Td>{extractedData.dWCross1}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>Direct #2 (Attorney)</Table.Td>
                                <Table.Td>{extractedData.pDirect2}</Table.Td>
                                <Table.Td>{extractedData.dDirect2}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>Direct #2 (Witness)</Table.Td>
                                <Table.Td>{extractedData.pWDirect2}</Table.Td>
                                <Table.Td>{extractedData.dWDirect2}</Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                    <Button onClick={() => console.log(extractedData)}>
                        View Raw Data in Console
                    </Button>
                </Box>
            )}
        </>
    )
}