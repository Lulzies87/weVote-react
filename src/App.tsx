import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { server } from "./services/axiosInstance";
import { Poll } from "./types/poll";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Button } from "./components/ui/button";
import { NewPollForm } from "./components/NewPollForm";
import { useTenant } from "./context/TenantContext";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

function App() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [totalApartments, setTotalApartments] = useState(0);
  const { tenant, logout } = useTenant();
  const navigate = useNavigate();

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
    const statusTypes = ["Open", "Voted", "Closed", "Cancelled"];

    return statusTypes
      .map((status) => polls.filter((poll) => poll.status === status))
      .flat();
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="flex justify-between items-center m-4">
        <h1>Welcome, {tenant?.fName}</h1>
        <Button className="h-6 w-16" variant={"outline"} onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="font-bold text-2xl text-primary">
              Polls
            </CardTitle>
            <NewPollForm />
          </div>
        </CardHeader>

        <CardContent>
          {polls.length === 0 ? (
            <p>No polls were taken yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Poll Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {polls.map((poll) => (
                  <TableRow key={poll.id}>
                    <TableCell className="font-medium">
                      <Link to={`/polls/${poll.id}`}>{poll.title}</Link>
                    </TableCell>
                    <TableCell
                      className={`
                ${poll.status === "Open" ? "bg-green-100" : ""}
                ${poll.status === "Voted" ? "bg-yellow-100" : ""}
                ${poll.status === "Closed" ? "bg-gray-200" : ""}
                ${poll.status === "Cancelled" ? "bg-red-100" : ""}
                `}
                    >
                      {poll.status}
                    </TableCell>
                    <TableCell>
                      {poll.cost == 0 ? "No Cost" : poll.cost}
                    </TableCell>
                    <TableCell>
                      {poll.votes} / {totalApartments}
                    </TableCell>
                    <TableCell>
                      {new Date(poll.deadline).toLocaleDateString("en-GB")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default App;
