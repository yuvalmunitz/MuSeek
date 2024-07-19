const questions = [
  
  {
    question: "What type of user are you?",
    options: ["Lyricist", "Composer", "Both"],
    isMultipleChoice: false,
    field: "userType"
  },
  {
    question: "Are you a performer?",
    options: ["Yes", "No"],
    isMultipleChoice: false,
    field: "performer"
  },
  {
    question: "Do you record music?",
    options: ["Yes", "No"],
    isMultipleChoice: false,
    field: "recorder"
  },
  {
    question: "How much experience do you have in the music industry?",
    options: ["Beginner", "Intermediate", "Advanced", "Professional"],
    isMultipleChoice: false,
    field: "experience"
  },

  {
    question: "What genres of music do you enjoy?",
    options: ["Rock", "Pop", "Jazz", "Classical", "Hip Hop", "Electronic", "Country", "R&B", "Folk", "Metal"],
    isMultipleChoice: true,
    field: "genres"
  }
];

export default questions;