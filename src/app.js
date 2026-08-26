const { createApp, ref } = Vue;

const app = createApp({
  setup() {
    const faqs = ref([
      {
        question: "Can you play slots for free on FREE SLOTS?",
        answer:
          "Yes, it's completely free. Once you register, you'll have access to all the slot machines—no payments, no coins, and no hidden terms.",
        isOpen: false,
      },
      {
        question: "How to choose a good slot machine?",
        answer:
          "Try out a few slots with different themes and mechanics. Each one has its own set of bonus rounds, wilds, and scatters—the best way to find the slot that’s right for you is to simply play them and compare them.",
        isOpen: false,
      },
      {
        question: "What is the most popular free slot on FREE SLOTS?",
        answer:
          "We regularly add new slot machines, and every player has their own favorites. Take a look at our catalog—it features the platform's most exciting and engaging slots.",
        isOpen: false,
      },
      {
        question: "Where can you play free slots?",
        answer:
          "Right in your browser—on your computer, tablet, or phone. No downloads required; you can start playing right after you sign up.",
        isOpen: false,
      },
      {
        question: "Is there a way to guarantee a win at slots?",
        answer:
          "The outcome of each spin is random, and that's what makes it exciting. FREE SLOTS is an entertainment platform with no real-money bets or prizes, so play for fun, not for guaranteed results.",
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
