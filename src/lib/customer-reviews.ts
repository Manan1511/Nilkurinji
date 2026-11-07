export type CustomerReview = {
  id: string;
  name: string;
  location: string;
  body: string;
  photo?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    fit?: "cover" | "contain";
  };
};

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: "rituparna-bhattacharjee",
    name: "Rituparna bhattacharjee",
    location: "Guwahati, Assam",
    body: "I actually really loved it ,the aroma ,strong colour & taste - overall a very fine quality tea 😊. Being a milk tea lover ,it was really good experience.",
    photo: { src: "/images/reviews/review-01.jpeg", width: 720, height: 1280, alt: "Two cups of milk tea beside Nilkurinji tea leaves and a package" },
  },
  {
    id: "preeti-sharma",
    name: "Preeti Sharma",
    location: "Jhunjhunu, Rajasthan",
    body: "I really enjoyed Nilkurinji Premium Tea. It has a pleasant aroma, a refreshing taste, and a nice colour. The overall quality is good, and I had a lovely tea experience. Thank you! 😊",
    photo: { src: "/images/reviews/review-03.jpeg", width: 720, height: 1280, alt: "Cups of milk tea with a Nilkurinji Premium Tea package in the background" },
  },
  {
    id: "deepika-cherukuri",
    name: "Deepika Cherukuri",
    location: "Andhra Pradesh",
    body: "Not just saying... But I really loved your tea... Was so nice... I gave some tea powder to my mom also and she too said the same😊",
  },
  {
    id: "diksha-verma",
    name: "Diksha Verma",
    location: "M.P",
    body: "I really enjoyed the tea! It has a nice aroma, a rich colour, and a refreshing taste. The overall quality is good, and it makes for a lovely cup of tea. 😊☕",
    photo: { src: "/images/reviews/review-04.jpeg", width: 397, height: 548, alt: "A glass cup of tea with biscuits and Nilkurinji tea in the background" },
  },
  {
    id: "vanshika-sharma",
    name: "Vanshika Sharma",
    location: "Delhi",
    body: "I like the taste, and it doesn’t leave me feeling as heavy as some other teas do. Overall, I’ve had a pleasant experience with it.",
    photo: { src: "/images/reviews/review-02.jpeg", width: 746, height: 1280, alt: "Nilkurinji tea and cups, with a customer note about the tea" },
  },
  {
    id: "sneha-kanodia",
    name: "Sneha Kanodia",
    location: "Kanpur, UP",
    body: "I usually pay attention to how I feel after drinking tea. I’ve personally found this one comfortable to drink, without the acidity I sometimes experience with other teas.",
  },
  {
    id: "jagrity-varshney",
    name: "Jagrity Varshney",
    location: "Bangalore",
    body: "The tea tastes really good, and personally, I feel quite light after having it. It has become a nice part of my daily routine.",
    photo: { src: "/images/reviews/review-09.jpeg", width: 803, height: 1280, alt: "A cup of milk tea, tea leaves and Nilkurinji tea on a table" },
  },
  {
    id: "himanshi",
    name: "Himanshi",
    location: "Lucknow, UP",
    body: "I liked the overall tea experience, from the aroma to the flavour. It feels like a thoughtful choice for tea lovers.",
    photo: { src: "/images/reviews/review-08.jpeg", width: 794, height: 1280, alt: "A cup of milk tea with Nilkurinji tea leaves and flowers" },
  },
  {
    id: "pramita-chakraborty",
    name: "Pramita Chakraborty",
    location: "West Bengal",
    body: "The tea has a lovely flavour and a comforting aroma. I especially liked how enjoyable it was with my daily tea time.",
    photo: { src: "/images/reviews/review-06.jpeg", width: 982, height: 705, alt: "Nilkurinji tea packages photographed together", fit: "contain" },
  },
  {
    id: "neha-kumar",
    name: "Neha Kumar",
    location: "Pulwama ,J&K",
    body: "Absolutely loved this tea! It has a rich color, strong refreshing taste, and an amazing aroma that instantly brightens up your day. Highly recommended for all tea lovers! ⭐⭐⭐⭐⭐",
  },
  {
    id: "nisha-prasad",
    name: "Nisha prasad",
    location: "Chhattisgarh",
    body: "Thank you so much! ❤️ Nilkurinji Premium Tea has a lovely aroma, a refreshing taste, and a beautiful colour. The overall quality feels really good, making it a perfect choice for tea lovers. ☕🌿✨",
    photo: { src: "/images/reviews/review-07.jpeg", width: 953, height: 1280, alt: "A cup of Nilkurinji tea in front of its package" },
  },
  {
    id: "lucky-neeti-manhas",
    name: "Lucky Neeti Manhas",
    location: "Agra",
    body: "A great option for those who enjoy strong chai, just a small amount of tea leaves delivers a rich, bold flavour!",
    photo: { src: "/images/reviews/review-05.jpeg", width: 839, height: 1280, alt: "Nilkurinji Premium Tea package displayed on a red fabric background" },
  },
];
