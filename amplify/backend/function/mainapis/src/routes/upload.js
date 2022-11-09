const { Router } = require("express");
const AWS = require('aws-sdk')
const config = require('../config')
const s3 = new AWS.S3(config.awsS3Config);

const Bucket = config.uploadS3Bucket
const Expires = 60 * 60 * 2 // 2 hours

const router = Router();

router.get('/presigned_link', async (req, res) => {
  const presignedPost = await s3.createPresignedPost({
    Bucket,
    Expires,
    Conditions: [
      ["starts-with", "$key", "images/"],
      ["content-length-range", 0, 10000000] // 10 Mb
    ]
  });

  res.json(presignedPost)
})

module.exports = router
