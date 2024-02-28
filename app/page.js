"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {
  ListBucketsCommand,
  ListObjectsCommand,
  ListObjectsCommandOutput,
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
const client = new S3Client({
  region: "us-east-2",
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: "us-east-2" },
    identityPoolId: "us-east-2:a5f13f29-38c5-439c-b15a-1b8551623888",
  }),
});

const bucketConnectors = [
  {
    bucket: 1,
    link: "https://d3f3xhuosr3mrt.cloudfront.net/",
  },
  {
    bucket: 2,
    link: "https://dsxm9hdw74gkj.cloudfront.net/",
  },
  {
    bucket: 3,
    link: "https://d10czu96rxwtth.cloudfront.net/",
  },
  {
    bucket: 4,
    link: "https://d371a58l8its3s.cloudfront.net/",
  },
];

export default function Home() {
  const [objects, setObjects] = useState([]);
  const [buckets, setBuckets] = useState([]);

  const [file, setFile] = useState();
  const [uploadStatus, setUploadStatus] = useState({});
  const [selectedBucket, setSelectedBucket] = useState('default-bucket');
  useEffect(() => {
    const command = new ListObjectsCommand({ Bucket: "getstartedbucket-01" });
    client.send(command).then(({ Contents }) => setObjects(Contents));


  }, []);
 


  const resetUploadStatus = () => {
    setUploadStatus({});
  };


  const delay = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function handleUpload(e) {
    const file = e.target.files[0];
    setFile(file);
    console.log(file)
    // Set CORS headers
  const headers = { 
    'Origin': 'http://localhost:3000/',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'x-amz-meta-custom'
  };

    // const videoTypes = ['video/mp4'];

    // if(!videoTypes.includes(file.type)) {
    //   alert('Only mp4 video files are allowed');
    //   return;
    // }
    // Before upload
    setUploadStatus((status) => ({ ...status, [file.name]: "Uploading" }));
    try {
      const command = new PutObjectCommand({
        Bucket: selectedBucket,
        Key: file.name,
        Body: file,
        // Metadata: {
        //   'Content-Type': 'video/mp4'
        // }
      });

      await client.send(command);
      setObjects((prevObjects) => [
        ...prevObjects,
        {
          Key: file.name,
          // other props like Size, LastModified, etc
        },
      ]);
      // On success
      setUploadStatus((status) => ({ ...status, [file.name]: "Success" }));
      await delay(1000);

      resetUploadStatus();
    } catch (err) {
      // On error
      setUploadStatus((status) => ({ ...status, [file.name]: "Error" }));
      await delay(1000);

      resetUploadStatus();
    }
  }
  return (
    <main className={styles.main}>
      <div className={styles.grid}>
      {
            objects.map((o) => (
              <div key={o.Key}>
                <h6>{o.Key}</h6>
              </div>
            ))
            }
            <select value={selectedBucket} onChange={(e) => setSelectedBucket(e.target.value)}>
        {bucketConnectors.map(bucket => (
          <option key={bucket.bucket} value={bucket.bucket}>{bucket.bucket}</option>
        ))}  
      </select>
            <input type="file" onChange={handleUpload} />
             {file && <p>Uploading {file.name}...</p>}
            {Object.entries(uploadStatus).map(([name, status]) => (
              <div>
                {name}: {status}
              </div>
            ))} 
            </div>
        </main>
  );
} 
