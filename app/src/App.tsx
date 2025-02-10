import { useEffect, useState } from "react";
import { server } from "./services/axiosInstance";
import "./App.scss";
import React from "react";

interface Poll {
  id: number,
  title: string,
  status: string,
  cost: number,
  votes: number,
  deadline: Date,
  created_at: Date
}

function App() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    async function getPolls() {
      try {
        const res = await server.get("/polls");
        const arrangedPolls = arrangeByStatus(res.data);
        setPolls(arrangedPolls);
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

  return (
    <>
      <h1 className='headline m-4'>Welcome to weVote!</h1>

      <article className="text-left m-4 p-2 border rounded">

        <div className="flex justify-between items-center">
          <h2>Polls</h2>
          <button className="w-8 h-8 rounded">+</button>
        </div>

        <section className="pt-2 grid grid-cols-5 gap-x-4">
          <h3>Poll name</h3>
          <h3>Status</h3>
          <h3>Cost (per apartment)</h3>
          <h3>Votes</h3>
          <h3>Deadline</h3>

          {polls.map((poll) => (
            <React.Fragment key={poll.id}>
              <p>{poll.title}</p>
              <p
                className={`
                ${poll.status === 'Open' ? 'text-green-500' : ''}
                ${poll.status === 'Voted' ? 'text-yellow-500' : ''}
                ${poll.status === 'Closed' ? 'text-purple-500' : ''}
                ${poll.status === 'Cancelled' ? 'text-red-500' : ''}
              `}
              >{poll.status}</p>
              <p>{poll.cost == 0 ? 'No cost' : poll.cost + ' NIS'}</p>
              <p>{poll.votes} / 80</p>
              <p>{new Date(poll.deadline).toLocaleDateString('en-GB')}</p>
            </React.Fragment>
          ))}
        </section>
      </article>
    </>
  );
}

export default App;
