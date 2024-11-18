// src/main/services/api.ts
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const uploadScreenshot = async (screenshotPath: string, testId: string) => {
  const formData = new FormData();
  formData.append('image', fs.createReadStream(screenshotPath));
  formData.append('test_id', testId);

  const token = localStorage.getItem('token');
  // const token = ''
  const response = await axios.post(
    'http://localhost:8080/api/v1/organization/submit',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response;
};

export default uploadScreenshot;
