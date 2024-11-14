import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {HuffmanCompressor} from "./huffman-compressor.ts";

interface FormData {
    toArchiveText: string
}

const exampleText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. В далекой-далекой галактике жил был текст. Он любил пробелы, запятые и точки. Каждый день он гулял по страницам, встречался с новыми словами и знаками препинания. Однажды он решил отправиться в путешествие к неизвестным абзацам, чтобы открыть тайны великих рассказов и романов. Так началось его удивительное путешествие."


function App() {

    const {register, handleSubmit, watch} = useForm<FormData>()
    const [compressed, setCompressed] = useState<string | null>(null)
    const [decompressed, setDecompressed] = useState<string | null>(null)
    const [compressionRatio, setCompressionRatio] = useState<number>(0)
    const [relativeEfficiencyFactor, setRelativeEfficiencyFactor] = useState<number>(0)
    const [huffmanCompressor, setHuffmanCompressor] = useState(new HuffmanCompressor())


    const onSubmit = (data: FormData) => {
        const compressed = huffmanCompressor.compress(data.toArchiveText);
        setCompressed(compressed)

        setCompressionRatio(huffmanCompressor.getCompressionRatio())
        setRelativeEfficiencyFactor(huffmanCompressor.getCompressionEfficiency())

        console.log("Коды Хаффмана:", huffmanCompressor.getCodes());
    }

    const getDecompressed = () => {
        if (compressed) {
            setDecompressed(huffmanCompressor.decompress(compressed))
        }
    }

    const value = watch('toArchiveText')

    useEffect(() => {
        setHuffmanCompressor(new HuffmanCompressor())
    }, [value]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .catch(() => {
                console.error("Не удалось скопировать текст в буфер обмен");
            });
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100vh',
            maxWidth: '100%',
            justifyContent: 'center',
            gap: '12px'
        }}>

            <Typography variant="caption">{exampleText}</Typography>
            <Button onClick={() => copyToClipboard(exampleText)}>Копировать текст</Button>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack sx={{gap: '24px'}}>
                    <TextField label="Outlined" variant="filled" {...register('toArchiveText')} />
                    <Box sx={{
                        display: 'flex',
                        gap: '12px'
                    }}>
                        <Button type='submit' variant='contained'>Архивировать</Button>
                        <Button onClick={() => getDecompressed()} variant='outlined'>Деархивировать</Button>
                    </Box>
                </Stack>
            </form>
            {compressed && <Typography variant="body1">{`Сжатый текст: ${compressed}`}</Typography>}
            {decompressed && <Typography variant="body1">{`Деархивированный текст: ${decompressed}`}</Typography>}
            {!!compressionRatio &&
                <Typography variant="body1">{`Коэффициент сжатия (K_cc): ${compressionRatio}`}</Typography>}
            {!!relativeEfficiencyFactor && <Typography
                variant="body1">{`Коэффициент относительной эффективности (K_oe): ${relativeEfficiencyFactor}`}</Typography>}
        </Box>
    )
}

export default App
