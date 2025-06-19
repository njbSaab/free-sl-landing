const { createApp, ref } = Vue;

const app = createApp({
  setup() {
    const faqs = ref([
      {
        question: "Can I play slots for free on Slotomania?",
        answer:
          "Absolutely! Slotomania has a huge variety of free slot games for you to spin and enjoy! Whether you’re looking for classic slots or video slots, they are all free to play.",
        isOpen: false,
      },
      {
        question: "How do I pick a good slot machine?",
        answer:
          "Rest assured that we’re committed to making all of our slot games FUNtastic! They are all unique in their own way so picking the best one for you can be tricky. To better understand each slot machine, click on the “Pay Table” option inside the menu in every slot. Once you’ve found the slot machine you like best, get to spinning and winning!",
        isOpen: false,
      },
      {
        question: "Can I play slots for free on Slotomania?",
        answer:
          "Absolutely! Slotomania has a huge variety of free slot games for you to spin and enjoy! Whether you’re looking for classic slots or video slots, they are all free to play.",
        isOpen: false,
      },
      {
        question: "How do I pick a good slot machine?",
        answer:
          "Rest assured that we’re committed to making all of our slot games FUNtastic! They are all unique in their own way so picking the best one for you can be tricky. To better understand each slot machine, click on the “Pay Table” option inside the menu in every slot. Once you’ve found the slot machine you like best, get to spinning and winning!",
        isOpen: false,
      },
      {
        question: "Is there a trick to winning slots?",
        answer:
          "As under-whelming as it may sound, Slotomania’s free online slot games use a random number generator – so everything just boils down to luck! Spinning slots is a game of possibilities. However, having a broad knowledge about different free casino slot games and their rules will certainly help you understand your chances better. Just hit the SPIN button and find out the answer to the burning question: What Will Today Spin?",
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
