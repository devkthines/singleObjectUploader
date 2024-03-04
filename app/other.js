
    // {/* {objects.map((o) => (
    //       <div key={o.Key}>
    //         <h6>{o.Key}</h6>
    //         {/* <Button variant="primary" onClick={() => downloadObject(o.Key)}>Click to Download</Button> */}
    //       </div>
    //     ))}
  // fetchBuckets();
 //  const fetchBuckets = async () => {

  //     const command = new ListBucketsCommand({});

  //     try {
  //       const response = await client.send(command);
  //       setBuckets(response);
  //       setIsLoading(false); // Set loading to false once buckets are fetched
  //       console.log("Buckets:", response); // Console log the buckets array
  //     } catch (err) {
  //       console.error('this is the error: ',err);
  //       setIsLoading(false); // Set loading to false in case of error
  //     }
  //   };
      {/* <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>app/page.js</code>
        </p>{" "}
        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={100}
            height={40}
            priority
          />
        </div>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>/*/}


      async function handleUpload(e) {

        const file = e.target.files[0];
      
        // Set CORS headers
        const headers = { 
          'Origin': 'yourdomain.com',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'x-amz-meta-custom'
        };
      
        // Preflight request
        const optionsReq = new PutObjectCommand({
          Bucket: selectedBucket,
          Key: file.name,
          Headers: headers,
          Method: 'OPTIONS'
        });
      
        const optionsRes = await client.send(optionsReq);
      
        // Check for CORS headers
        if(!optionsRes.Metadata['Access-Control-Allow-Origin']) {
          throw new Error('CORS error'); 
        }
      
        // Actual upload
        const uploadReq = new PutObjectCommand({
          Bucket: selectedBucket,
          Key: file.name,
          Body: file,
          Headers: headers
        });
      
        const uploadRes = await client.send(uploadReq);
      
        // Handle errors
        if(!uploadRes.$metadata.httpStatusCode === 200) {
          throw new Error('Upload failed');
        }
      
        // Rest of upload logic  
      
      }
      
      // Other client code
      
      const downloadRes = await client.send(getObjectCommand);
      
      if(downloadRes.Metadata['x-amz-error-code']) {
        // handle S3 error  
      }
      
      // etc