import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { server } from "./services/axiosInstance";
import { Modal } from "./components/modal";
import { Poll } from "./types/poll";

function App() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [totalApartments, setTotalApartments] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    async function getPolls() {
      try {
        const res = await server.get("/polls");
        const arrangedPolls = arrangeByStatus(res.data.polls);
        setPolls(arrangedPolls);
        setTotalApartments(res.data.totalApartments);
      } catch (error) {
        console.error("Failed to fetch polls", error);
      }
    }

    getPolls();
  }, []);

  function arrangeByStatus(polls: Poll[]) {
    const statuses = ['Open', 'Voted', 'Closed', 'Cancelled'];

    return statuses.map(status => polls.filter(poll => poll.status === status)).flat();
  }

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <>
      <h1 className='m-4 text-center'>Welcome to weVote!</h1>

      <article className="m-4 p-2 border rounded">

        <div className="flex justify-between items-center">
          <h2>Polls</h2>
          <button className="w-8 h-8" onClick={openModal}>+</button>
        </div>

        <section className="pt-2 grid grid-cols-5 gap-x-4">
          {["Poll name", "Status", "Cost", "Votes", "Deadline"].map((title, index) => {
            return <h3 key={index}>{title}</h3>
          })}

          {polls.map((poll) => (
            <React.Fragment key={poll.id}>
              <p>
                <Link to={`/polls/${poll.id}`}>{poll.title}</Link>
              </p>
              <p
                className={`
                ${poll.status === 'Open' ? 'text-green-500' : ''}
                ${poll.status === 'Voted' ? 'text-yellow-500' : ''}
                ${poll.status === 'Closed' ? 'text-purple-500' : ''}
                ${poll.status === 'Cancelled' ? 'text-red-500' : ''}
              `}
              >{poll.status}</p>
              <p>{poll.cost == 0 ? 'No cost' : poll.cost + ' NIS'}</p>
              <p>{poll.votes} / {totalApartments}</p>
              <p>{new Date(poll.deadline).toLocaleDateString('en-GB')}</p>
            </React.Fragment>
          ))}
        </section>
      </article>

      <Modal isVisible={isModalVisible} onClose={closeModal} />
    </>
  );
}

export default App;
