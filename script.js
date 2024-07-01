const socket = io("http://localhost:8000");

const progressBoxes = document.querySelectorAll(".progress-box");
const percentTags = document.querySelectorAll(".percent-tag");
const totalVotesElem = document.getElementById("totalVotes");

// Check if the user has already voted when the page loads
let vote = localStorage.getItem("hasVoted") === "true";

if (vote) {
  alert("You have already voted!");
}

for (let i = 0; i < progressBoxes.length; i++) {
  const elem = progressBoxes[i];
  elem.addEventListener("click", () => {
    addVote(elem, elem.id);
  });
}

const addVote = (elem, id) => {
  if (vote) {
    alert("You have already voted!");
    return;
  }
  let voteTo = id;
  socket.emit("send-vote", voteTo);
  vote = true;
  localStorage.setItem("hasVoted", "true");
  elem.classList.add("active");
};

socket.on("receive-vote", (data) => {
  updatePolls(data);
});

socket.on("update", (data) => {
  updatePolls(data);
  console.log(data);
});

const updatePolls = (data) => {
  let votingObject = data.votingPolls;
  let totalVotes = data.totalVotes;
  totalVotesElem.innerHTML = totalVotes;
  for (let i = 0; i < percentTags.length; i++) {
    let vote = votingObject[progressBoxes[i].id];
    let setWidth = Math.round((vote / totalVotes) * 100);
    const elem = document
      .querySelector(`#${progressBoxes[i].id}`)
      .querySelector(".percent-tag");
    elem.setAttribute("data", `${!setWidth ? 0 : setWidth}%`);
    elem.style.width = `${!setWidth ? 0 : setWidth}%`;
    console.log(elem);
  }
};
