# Truy cập S3 từ VPC bằng Gateway Endpoint

Trong phần này, bạn sẽ tạo một **Gateway endpoint** để truy cập **Amazon S3** từ một **EC2 instance**. **Gateway endpoint** sẽ cho phép tải một object lên S3 bucket mà không cần sử dụng **Internet Công cộng** (Public Internet). Để tạo endpoint, bạn phải chỉ định VPC mà bạn muốn tạo endpoint và dịch vụ (trong trường hợp này là S3) mà bạn muốn thiết lập kết nối.

![overview](/images/5-Workshop/5.3-S3-vpc/diagram2.png)

### 1. Tạo một Gateway Endpoint

1. Mở [Amazon VPC console](https://us-east-1.console.aws.amazon.com/vpc/home?region=us-east-1#Home:)
2. Trong thanh điều hướng, chọn **Endpoints**, click **Create Endpoint**:

> **Note:** Bạn sẽ thấy **6 điểm cuối VPC hiện có** hỗ trợ **AWS Systems Manager (SSM)**. Các điểm cuối này được Mẫu CloudFormation triển khai tự động cho workshop này.

![endpoint](/images/5-Workshop/5.3-S3-vpc/endpoints.png)

3. Trong Create endpoint console:
+ Đặt tên cho endpoint: `s3-gwe`
+ Trong service category, chọn **aws services**

![endpoint](/images/5-Workshop/5.3-S3-vpc/create-s3-gwe1.png)

+ Trong **Services**, gõ `s3` trong hộp tìm kiếm và chọn dịch vụ với loại **gateway**

![endpoint](/images/5-Workshop/5.3-S3-vpc/services.png)

+ Đối với VPC, chọn **VPC Cloud** từ drop-down menu.
+ Đối với **Route tables**, chọn bảng định tuyến mà đã liên kết với **2 subnets** (lưu ý: đây không phải là bảng định tuyến chính cho VPC mà là bảng định tuyến thứ hai do CloudFormation tạo).

![endpoint](/images/5-Workshop/5.3-S3-vpc/vpc.png)

+ Đối với **Policy**, để tùy chọn mặc định là **Full access** để cho phép toàn quyền truy cập vào dịch vụ. Bạn sẽ triển khai **VPC endpoint policy** trong phần sau để chứng minh việc hạn chế quyền truy cập vào **S3 bucket** dựa trên các policies.

![endpoint](/images/5-Workshop/5.3-S3-vpc/policy.png)

+ Không thêm tag vào VPC endpoint.
+ Click **Create endpoint**, click x sau khi nhận được thông báo tạo thành công.

![endpoint](/images/5-Workshop/5.3-S3-vpc/complete.png)

### 2. Kiểm tra Gateway Endpoint

#### Tạo S3 bucket

1. Đi đến **S3 management console**
2. Trong Bucket console, chọn **Create bucket**

![Create bucket](/images/5-Workshop/5.3-S3-vpc/create-bucket.png)

3. Trong **Create bucket console**
+ **Đặt tên bucket**: chọn 1 tên mà không bị trùng trong phạm vi toàn cầu (gợi ý: lab-number-your-name)

![Bucket name](/images/5-Workshop/5.3-S3-vpc/bucket-name.png)

+ Giữ nguyên giá trị của các fields khác (default)
+ Kéo chuột xuống và chọn **Create bucket**

![Create](/images/5-Workshop/5.3-S3-vpc/create-button.png)    

+ Tạo thành công S3 bucket.

![Success](/images/5-Workshop/5.3-S3-vpc/bucket-success.png)

#### Kết nối với EC2 bằng session manager

+ Trong workshop này, bạn sẽ dùng **AWS Session Manager** để kết nối đến các **EC2 instances**. **Session Manager** là 1 tính năng trong dịch vụ **Systems Manager** được quản lý hoàn toàn bởi AWS. Session Manager cho phép bạn quản lý **Amazon EC2 instances** và các máy ảo on-premises (VMs) thông qua 1 browser-based shell tương tác. Session Manager cung cấp khả năng quản lý phiên bản an toàn và có thể kiểm tra mà không cần mở cổng vào (open inbound ports), duy trì máy chủ bastion host hoặc quản lý khóa SSH.
+ First cloud journey [Lab](https://000058.awsstudygroup.com/1-introduce/) để hiểu sâu hơn về Session manager.

1. Trong **AWS Management Console**, gõ `Systems Manager` trong ô tìm kiếm và nhấn **Enter**:

![system manager](/images/5-Workshop/5.3-S3-vpc/sm.png)

2. Từ **Systems Manager** menu, tìm **Node Management** ở thanh bên trái và chọn **Session Manager**:

![system manager](/images/5-Workshop/5.3-S3-vpc/sm1.png)

3. Click **Start Session**, và chọn EC2 instance tên **Test-Gateway-Endpoint**. 

> **Info:** Phiên bản EC2 này đã chạy trong "VPC Cloud" và sẽ được dùng để kiểm tra khả năng kết nối với Amazon S3 thông qua điểm cuối Cổng mà bạn vừa tạo (s3-gwe).

![Start session](/images/5-Workshop/5.3-S3-vpc/start-session.png)

**Session Manager** sẽ mở browser tab mới với shell prompt: sh-4.2 $

![Success](/images/5-Workshop/5.3-S3-vpc/start-session-success.png)

Bạn đã bắt đầu phiên kết nối đến EC2 trong VPC Cloud thành công. Trong bước tiếp theo, chúng ta sẽ tạo một S3 bucket và một tệp trong đó.

#### Tạo 1 file và tải lên S3 bucket

1. Đổi về ssm-user's thư mục bằng lệnh `cd ~` 

![Change user's dir](/images/5-Workshop/5.3-S3-vpc/cli1.png)

2. Tạo 1 file để kiểm tra bằng lệnh `fallocate -l 1G testfile.xyz`, 1 file tên "testfile.xyz" có kích thước 1GB sẽ được tạo.

![Create file](/images/5-Workshop/5.3-S3-vpc/cli-file.png)

3. Tải file mình vừa tạo lên S3 với lệnh `aws s3 cp testfile.xyz s3://your-bucket-name`. Thay your-bucket-name bằng tên S3 bạn đã tạo.

![Uploaded](/images/5-Workshop/5.3-S3-vpc/uploaded.png)

Bạn đã tải thành công tệp lên bộ chứa S3 của mình. Bây giờ bạn có thể kết thúc session.

#### Kiểm tra object trong S3 bucket

1. Đi đến S3 console.  
2. Click tên s3 bucket của bạn
3. Trong Bucket console, bạn sẽ thấy tệp bạn đã tải lên S3 bucket của mình

![Check S3](/images/5-Workshop/5.3-S3-vpc/check-s3-bucket.png)

#### Tóm tắt

Chúc mừng bạn đã hoàn thành truy cập S3 từ VPC. Trong phần này, bạn đã tạo Gateway endpoint cho Amazon S3 và sử dụng AWS CLI để tải file lên. Quá trình tải lên hoạt động vì Gateway endpoint cho phép giao tiếp với S3 mà không cần Internet gateway gắn vào "VPC Cloud". Điều này thể hiện chức năng của Gateway endpoint như một đường dẫn an toàn đến S3 mà không cần đi qua Public Internet.
