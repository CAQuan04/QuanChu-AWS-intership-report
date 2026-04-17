### Mục Tiêu Tuần 11

* Đưa hệ thống vào bài test "tra tấn" (Stress test) để truy vét các lỗi trả Data sai từ AI.
* Sàng lọc và bít lỗ hổng các trường hợp mô hình sinh ảo giác (hallucination) trước giờ G.
* Trình bày và hoàn thiện hệ thống tài liệu.
* Làm form Slide thuyết trình nhấn mạnh vào cấu trúc Đa-Mô Hình (Multi-model) của Anthropic mà team áp dụng.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Bắt đầu | Hoàn thành | Tài liệu tham khảo |
| --- | --- | --- | --- | --- |
| 1 | - Nhồi nhét Chaos Testing <br>&emsp; + Mớm vào miệng AI Engine đủ thể loại input rườm rà. <br>&emsp; + Giảm sâu Bedrock `temperature` về 0.1 để ép nó phải có tư duy toán học bảo thủ, bớt bốc phét lại. | 09/04/2026 | 09/04/2026 | [Claude Bedrock Parameters](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages.html) |
| 2 | - Thống kê Thông số <br>&emsp; + Đánh giá tỷ lệ dính JSON chuẩn chỉnh. Đạt ngưỡng 98% pass qua 100 lượt thử máu. | 10/04/2026 | 10/04/2026 | - |
| 3 | ⭐ **SỰ KIỆN:** AWS Cloud Mastery 3 (ĐH FPT) <br>&emsp; - Phác thảo Presentation Deck <br>&emsp; + Chụp các bản đồ Diagram kiến trúc bỏ vô Slide. <br>&emsp; + Kể câu chuyện cắt chi phí tối đa nhờ chẻ Data qua Haiku và Sonnet. | 11/04/2026 | 11/04/2026 | - |
| 4 | - Báo cáo Tài Chính (Pricing) <br>&emsp; + Đóng gói file tính tiền mảng AppSync requests, Tokens, và Cloudfront. Gõ trọn vẹn hóa đơn $60.87/tháng. | 12/04/2026 | 12/04/2026 | [AWS Pricing Calculator](https://calculator.aws/) |
| 5 | - Cày Tài liệu Document <br>&emsp; + Đúc kết những thành tựu của mảng AI/ML vào kho tàng Workshop Appendices. | 13/04/2026 | 13/04/2026 | - |
| 6 | - Diễn Tập Tổng Phác (End-to-End) <br>&emsp; + Cầm điện thoại chạy thẳng trên App Expo Go để lướt mướt luồng. <br>&emsp; + Cùng member Demo chém gió mượt mà. | 14/04/2026 | 14/04/2026 | - |
| 7 | - Gọt dũa lại lần cuối <br>&emsp; + Căn giờ bấm đồng hồ thuyết trình để không lố giờ của ban GK. | 15/04/2026 | 15/04/2026 | - |

### Kết quả đạt được Tuần 11

* An tâm tuyệt đối với dòng Tokens sinh ra. Việc chạy `temperature: 0.1` đã tiệt nọc sạch sẽ những màn chém lượng Calo ảo lòi của Recipe Generator.
* Chốt sổ thành công một bản báo cáo giá tiền cực nét, sẵn sàng "flex" sự tối ưu chi phí Serverless của dự án làm lợi thế phòng bị trước các câu hỏi học thuật từ Ban Giám Khảo.
* Diễn tập lần cuối trọn vẹn 10 điểm. Độ trễ (Latency) giật cục của Bedrock giờ đây đã được khỏa lấp xuất sắc bằng hiệu ứng Loading màn hình của App.

### Khó khăn & Bài học

* **Khó khăn:** 
  * Đem mớ kiến thức phức tạp của Generative AI Prompts ra nhét vào một cái Slide thuyết trình làm sao cho những người mù mờ Code nghe vẫn hiểu là không hề đơn giản.
* **Giải pháp:** 
  * Chuyển hóa những bài luận múa chữ thành các flow chart chỉ thẳng mặt mũi thằng Claude đang đứng xếp Data ra sao. Rõ ràng và dễ hình dung.
* **Bài học:** 
  * Trình độ thiết kế Prompts tối ưu hóa và khả năng tùy biến Model Framework mới là chìa khóa bảo chứng cho sự khả thi mang vào kinh doanh của app, chứ không phải việc app đó chạy xịn tới đâu.

### Kế hoạch Tuần tới

* Trận chiến cuối cùng! Final Battle!
* Báo cáo đồ án Final Presentation trước toàn bộ các Mentors của chương trình FCJ.
* Viết bản luận self-assessment (đánh giá bản thân) sau khóa thực tập này.
