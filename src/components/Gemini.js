import React, { useState } from 'react';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import MarkdownIt from 'markdown-it';

const API_KEY = "AIzaSyBGgNYaSBT5XJ28ynVGF4YDacQ-M7pZhj8";

const Chatbot = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuestionSubmit = async () => {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    setLoading(true);
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const result = await model.generateContent([question]);
      setAnswer(result.response.text());
    } catch (error) {
      console.error("Error generating answer:", error);
      setAnswer("Error generating the answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>Chatbot: Ask a Question</h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows="4"
        placeholder="Type your question here..."
        className="textarea"
      />
      <button onClick={handleQuestionSubmit} disabled={loading} className="button">
        {loading ? 'Loading...' : 'Get Answer'}
      </button>
      <div className="output">{answer && <p>Answer: {answer}</p>}</div>
    </div>
  );
};

const MultimodalPrompt = () => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !prompt.trim()) {
      alert("Please upload an image and enter a prompt.");
      return;
    }

    setLoading(true);
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    try {
      const imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
      });

      const contents = [
        {
          role: 'user',
          parts: [
            { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } },
            { text: prompt },
          ],
        },
      ];

      const result = await model.generateContentStream({ contents });
      let buffer = [];
      let md = new MarkdownIt();
      for await (let response of result.stream) {
        buffer.push(response.text());
        setOutput(md.render(buffer.join('')));
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setOutput("Error generating content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>Multimodal: Image and Text Prompt</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} className="input-file" />
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your text prompt..."
          className="input-text"
        />
        <button type="submit" disabled={loading} className="button">
          {loading ? 'Loading...' : 'Generate Content'}
        </button>
      </form>
      <div className="output" dangerouslySetInnerHTML={{ __html: output }}></div>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <h1 className="title">Gemini API Demo</h1>
      <Chatbot />
      <MultimodalPrompt />
    </div>
  );
};

export default App;
