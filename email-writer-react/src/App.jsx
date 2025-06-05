import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import {
  Box,
  Container,
  FormControl,
  MenuItem,
  TextField,
  Typography,
  Button,
  Snackbar,
} from '@mui/material';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = async () => {
    if (!emailContent || !tone) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitted(true);
    setLoading(true);
    setError('');
    setGeneratedReply('');

    try {
      const response = await fetch('http://localhost:8080/api/email/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailContent, tone }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); // expects { reply: "..." }
      setGeneratedReply(data.reply);
    } catch (error) {
      setError('Failed to generate reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopySuccess(true);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Email Generator
      </Typography>

      <Box sx={{ mt: 4 }}>
        <TextField
          label="Enter the email content here"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={emailContent}
          placeholder="Type your email content here..."
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          inputProps={{ maxLength: 500 }}
          helperText="Max 500 characters"
          error={emailContent.length > 500}
          FormHelperTextProps={{
            style: { color: emailContent.length > 500 ? 'red' : 'inherit' },
          }}
          onChange={(e) => setEmailContent(e.target.value)}
        />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <TextField
            select
            label="Response Tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="formal">Formal</MenuItem>
            <MenuItem value="informal">Informal</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
            <MenuItem value="apologetic">Apologetic</MenuItem>
          </TextField>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailContent || !tone || loading}
          sx={{ mt: 3 }}
        >
          {loading ? 'Generating...' : 'Generate Reply'}
        </Button>

        {submitted && error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {submitted && !loading && generatedReply && (
          <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
            <Typography variant="h6">Generated Reply:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {generatedReply}
            </Typography>
            <Button variant="outlined" size="small" onClick={handleCopy}>
              Copy to Clipboard
            </Button>
          </Box>
        )}
      </Box>

      <footer style={{ textAlign: 'center', marginTop: '40px' }}>
        <img src={viteLogo} className="logo" alt="Vite logo" />
        <img src={reactLogo} className="logo react" alt="React logo" />
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR updates.
        </p>
        <p>
          <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
            Vite Documentation
          </a>
          {' | '}
          <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            React Documentation
          </a>
        </p>
      </footer>

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="Copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
}

export default App;
