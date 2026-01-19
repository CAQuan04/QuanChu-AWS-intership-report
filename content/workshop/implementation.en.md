# Access S3 from VPC using Gateway Endpoint

In this section, you will create **a Gateway endpoint** to access **Amazon S3** from **an EC2 instance**. **The Gateway endpoint** will allow upload an object to S3 buckets without using **the Public Internet**. To create an endpoint, you must specify the VPC in which you want to create the endpoint, and the service (in this case, S3) to which you want to establish the connection.

![overview](/images/5-Workshop/5.3-S3-vpc/diagram2.png)

### 1. Create a gateway endpoint

1. Open the [Amazon VPC console](https://us-east-1.console.aws.amazon.com/vpc/home?region=us-east-1#Home:)
2. In the navigation pane, choose **Endpoints**, then click **Create Endpoint**:

> **Note:** You will see **6 existing VPC endpoints** that support **AWS Systems Manager (SSM)**. These endpoints were deployed automatically by the **CloudFormation Templates** for this workshop.

![endpoint](/images/5-Workshop/5.3-S3-vpc/endpoints.png)

3. In the Create endpoint console:
+ Specify name of the endpoint: `s3-gwe`
+ In service category, choose **AWS services**

![endpoint](/images/5-Workshop/5.3-S3-vpc/create-s3-gwe1.png)

+ In **Services**, type `s3` in the search box and choose the service with type **gateway**

![endpoint](/images/5-Workshop/5.3-S3-vpc/services.png)

+ For VPC, select **VPC Cloud** from the drop-down.
+ For **Configure route tables**, select the route table that is already associated with **two subnets** (note: this is not the main route table for the VPC, but a second route table created by CloudFormation).

![endpoint](/images/5-Workshop/5.3-S3-vpc/vpc.png)

+ **For Policy**, leave the default option, **Full Access**, to allow full access to the service. You will deploy **a VPC endpoint policy** in a later lab module to demonstrate restricting access to **S3 buckets** based on policies.

![endpoint](/images/5-Workshop/5.3-S3-vpc/policy.png)

+ Do not add a tag to the VPC endpoint at this time.
+ Click **Create endpoint**, then click x after receiving a successful creation message.

![endpoint](/images/5-Workshop/5.3-S3-vpc/complete.png)

### 2. Test the Gateway Endpoint

#### Create S3 bucket

1. Navigate to **S3 management console**
2. In the Bucket console, choose **Create bucket**

![Create bucket](/images/5-Workshop/5.3-S3-vpc/create-bucket.png)

3. In **the Create bucket console**
+ **Name the bucket**: choose a name that hasn't been given to any bucket globally (hint: lab number and your name)

![Bucket name](/images/5-Workshop/5.3-S3-vpc/bucket-name.png)

+ Leave other fields as they are (default)
+ Scroll down and choose **Create bucket**

![Create](/images/5-Workshop/5.3-S3-vpc/create-button.png) 

+ Successfully create S3 bucket.

![Success](/images/5-Workshop/5.3-S3-vpc/bucket-success.png)

#### Connect to EC2 with session manager

+ For this workshop, you will use **AWS Session Manager** to access several **EC2 instances**. **Session Manager** is a fully managed **AWS Systems Manager** capability that allows you to manage your **Amazon EC2 instances**  and on-premises virtual machines (VMs) through an interactive one-click browser-based shell. Session Manager provides secure and auditable instance management without the need to open inbound ports, maintain bastion hosts, or manage SSH keys.
+ First cloud journey [Lab](https://000058.awsstudygroup.com/1-introduce/) for indepth understanding of Session manager.

1. In the **AWS Management Console**, start typing `Systems Manager` in the quick search box and press **Enter**:

![system manager](/images/5-Workshop/5.3-S3-vpc/sm.png)

2. From the **Systems Manager** menu, find **Node Management** in the left menu and click **Session Manager**:

![system manager](/images/5-Workshop/5.3-S3-vpc/sm1.png)

3. Click **Start Session**, and select **the EC2 instance** named **Test-Gateway-Endpoint**. 

> **Info:** This EC2 instance is already running in "VPC Cloud" and will be used to test connectivity to Amazon S3 through the Gateway endpoint you just created (s3-gwe).

![Start session](/images/5-Workshop/5.3-S3-vpc/start-session.png)

**Session Manager** will open a new browser tab with a shell prompt: sh-4.2 $

![Success](/images/5-Workshop/5.3-S3-vpc/start-session-success.png)

You have successfully start a session - connect to the EC2 instance in VPC cloud. In the next step, we will create a S3 bucket and a file in it. 

#### Create a file and upload to s3 bucket

1. Change to the ssm-user's home directory by typing `cd ~` in the CLI

![Change user's dir](/images/5-Workshop/5.3-S3-vpc/cli1.png)

2. Create a new file to use for testing with the command `fallocate -l 1G testfile.xyz`, which will create a file of 1GB size named "testfile.xyz".

![Create file](/images/5-Workshop/5.3-S3-vpc/cli-file.png)

3. Upload file to S3 bucket with command `aws s3 cp testfile.xyz s3://your-bucket-name`. Replace your-bucket-name with the name of S3 bucket that you created earlier.

![Uploaded](/images/5-Workshop/5.3-S3-vpc/uploaded.png)

You have successfully uploaded the file to your S3 bucket. You can now terminate the session.

#### Check object in S3 bucket

1. Navigate to S3 console.  
2. Click the name of your s3 bucket
3. In the Bucket console, you will see the file you have uploaded to your S3 bucket

![Check S3](/images/5-Workshop/5.3-S3-vpc/check-s3-bucket.png)

#### Section summary

Congratulation on completing access to S3 from VPC. In this section, you created a Gateway endpoint for Amazon S3, and used the AWS CLI to upload an object. The upload worked because the Gateway endpoint allowed communication to S3, without needing an Internet Gateway attached to "VPC Cloud". This demonstrates the functionality of the Gateway endpoint as a secure path to S3 without traversing the Public Internet.
