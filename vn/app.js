const { createApp, ref } = Vue;

const app = createApp({
  setup() {
    const faqs = ref([
      {
        question: "Bạn có thể chơi máy đánh bạc miễn phí trên FREE SLOTS không?",
        answer:
          "Đúng vậy, hoàn toàn miễn phí. Ngay sau khi đăng ký, bạn sẽ có quyền truy cập vào tất cả các máy đánh bạc — không cần thanh toán, không cần xu và không có điều khoản ẩn nào cả.",
        isOpen: false,
      },
      {
        question: "Làm thế nào để chọn một máy đánh bạc tốt?",
        answer:
          "Hãy thử chơi một vài trò chơi slot với các chủ đề và cơ chế khác nhau. Mỗi trò chơi đều có các vòng thưởng, biểu tượng Wild và biểu tượng Scatter riêng — cách tốt nhất để tìm ra trò chơi slot phù hợp với bạn là đơn giản chỉ cần chơi thử và so sánh chúng.",
        isOpen: false,
      },
      {
        question: "Trò chơi slot miễn phí nào là phổ biến nhất trên FREE SLOTS?",
        answer:
          "Chúng tôi thường xuyên bổ sung các máy đánh bạc mới, và mỗi người chơi đều có những trò chơi yêu thích riêng. Hãy xem qua danh mục của chúng tôi — nơi tập hợp những trò chơi slot hấp dẫn và lôi cuốn nhất trên nền tảng này.",
        isOpen: false,
      },
      {
        question: "Bạn có thể chơi máy đánh bạc miễn phí ở đâu?",
        answer:
          "Ngay trên trình duyệt của bạn — trên máy tính, máy tính bảng hoặc điện thoại. Không cần tải xuống; bạn có thể bắt đầu chơi ngay sau khi đăng ký.",
        isOpen: false,
      },
      {
        question: "Có cách nào để đảm bảo chắc chắn thắng khi chơi máy đánh bạc không?",
        answer:
          "Kết quả của mỗi lần quay là ngẫu nhiên, và chính điều đó mới tạo nên sự hấp dẫn. FREE SLOTS là một nền tảng giải trí không có cược bằng tiền thật hay giải thưởng, vì vậy hãy chơi để giải trí, chứ không phải để mong đợi kết quả chắc chắn.",
        isOpen: false,
      },
    ]);

    function toggleFaq(index) {
      faqs.value[index].isOpen = !faqs.value[index].isOpen;
    }

    return { faqs, toggleFaq };
  },
});

app.mount("#app");
