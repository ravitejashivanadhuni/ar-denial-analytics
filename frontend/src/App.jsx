
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  Activity, AlertCircle, FileText, DollarSign,
  Search, RefreshCw
} from "lucide-react";
import "./App.css";

const API = "http://localhost:8080/api";

function App() {
  const [payers, setPayers] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [claims, setClaims] = useState([]);
  const [totalClaims, setTotalClaims] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [payer, setPayer] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const money = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2
    }).format(value || 0);

  async function loadAnalytics() {
    const [payerResponse, reasonResponse] = await Promise.all([
      fetch(`${API}/analytics/payers`),
      fetch(`${API}/analytics/reasons`)
    ]);

    if (!payerResponse.ok || !reasonResponse.ok) {
      throw new Error("Unable to load analytics");
    }

    setPayers(await payerResponse.json());
    setReasons(await reasonResponse.json());
  }

  async function loadClaims() {
    const params = new URLSearchParams({
      page: String(page),
      size: "10"
    });

    if (payer) params.set("payer", payer);
    if (reason) params.set("reason", reason);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    const response = await fetch(`${API}/claims?${params}`);

    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.message || "Unable to load claims");
    }

    const data = await response.json();
    setClaims(data.content);
    setTotalClaims(data.totalElements);
    setTotalPages(data.totalPages);
  }

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      await Promise.all([loadAnalytics(), loadClaims()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [page, payer, reason, startDate, endDate]);

  const totalDeniedAmount = payers.reduce(
    (sum, item) => sum + Number(item.totalDeniedAmount || 0), 0
  );

  const deniedCount = payers.reduce(
    (sum, item) => sum + Number(item.deniedClaimCount || 0), 0
  );

  function resetFilters() {
    setPayer("");
    setReason("");
    setStartDate("");
    setEndDate("");
    setPage(0);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Activity size={23} /></div>
          <div>
            <h2>ClaimScope</h2>
            <span>Healthcare Analytics</span>
          </div>
        </div>

        <div className="side-label">WORKSPACE</div>
        <div className="nav-item active">
          <Activity size={18} /> Denial Overview
        </div>

        <div className="side-bottom">
          <div className="profile">
            <div className="avatar">AR</div>
            <div>
              <strong>Analytics Team</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="breadcrumb">Workspace / Analytics</div>
            <h1>Denial Overview</h1>
            <p>Monitor claim denials and identify revenue leakage.</p>
          </div>
          <button className="refresh" onClick={loadDashboard}>
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        {error && <div className="error"><AlertCircle size={18} /> {error}</div>}

        {loading ? (
          <div className="loading">Loading analytics...</div>
        ) : (
          <>
            <section className="stats">
              <div className="stat-card">
                <div className="stat-top">
                  <span>Total Denied Amount</span>
                  <div className="stat-icon purple"><DollarSign /></div>
                </div>
                <h2>{money(totalDeniedAmount)}</h2>
                <span className="stat-note">Across all denied claims</span>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Denied Claims</span>
                  <div className="stat-icon orange"><FileText /></div>
                </div>
                <h2>{deniedCount}</h2>
                <span className="stat-note">Total denied claim records</span>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Insurance Payers</span>
                  <div className="stat-icon green"><Activity /></div>
                </div>
                <h2>{payers.length}</h2>
                <span className="stat-note">Payers with denied claims</span>
              </div>
            </section>

            <section className="analytics-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Denied Amount by Payer</h3>
                    <p>Financial impact across insurance providers</p>
                  </div>
                </div>

                <div className="chart">
                  {payers.length === 0 ? <div className="empty">No payer data available</div> :
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={payers} margin={{ top: 10, right: 10, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5" />
                        <XAxis dataKey="payer" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip formatter={(value) => money(value)} />
                        <Bar dataKey="totalDeniedAmount" fill="#6558d3" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  }
                </div>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Denial Reasons</h3>
                    <p>Amount by reason category</p>
                  </div>
                </div>

                <div className="reason-list">
                  {reasons.length === 0 ? <div className="empty">No reason data available</div> :
                    reasons.map((item) => (
                      <div className="reason-row" key={item.denialReason}>
                        <div className="reason-name">
                          <span>{item.denialReason}</span>
                          <strong>{money(item.totalDeniedAmount)}</strong>
                        </div>
                        <div className="progress">
                          <div style={{
                            width: `${Number(item.totalDeniedAmount) / Number(reasons[0].totalDeniedAmount) * 100}%`
                          }} />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </section>

            <section className="panel claims-panel">
              <div className="panel-heading">
                <div>
                  <h3>Denied Claims</h3>
                  <p>Review and filter individual claim records</p>
                </div>
                <span className="record-count">{totalClaims} records</span>
              </div>

              <div className="filters">
                <div className="filter-input">
                  <Search size={16} />
                  <select value={payer} onChange={(e) => { setPayer(e.target.value); setPage(0); }}>
                    <option value="">All Payers</option>
                    {payers.map((item) => <option key={item.payer}>{item.payer}</option>)}
                  </select>
                </div>

                <div className="filter-input">
                  <select value={reason} onChange={(e) => { setReason(e.target.value); setPage(0); }}>
                    <option value="">All Reasons</option>
                    {reasons.map((item) => <option key={item.denialReason}>{item.denialReason}</option>)}
                  </select>
                </div>

                <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(0); }} />
                <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(0); }} />

                <button className="clear-btn" onClick={resetFilters}>Clear filters</button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Claim ID</th>
                      <th>Payer</th>
                      <th>Provider</th>
                      <th>CPT Code</th>
                      <th>Denial Reason</th>
                      <th>Date</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.length === 0 ? (
                      <tr><td colSpan="7" className="empty-cell">No claims found</td></tr>
                    ) : claims.map((claim) => (
                      <tr key={claim.id}>
                        <td>#{claim.id}</td>
                        <td>{claim.payer}</td>
                        <td>{claim.provider}</td>
                        <td>{claim.cptCode}</td>
                        <td>{claim.denialReason}</td>
                        <td>{claim.deniedAt}</td>
                        <td className="amount">{money(claim.billedAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <span>Page {page + 1} of {Math.max(totalPages, 1)}</span>
                <div>
                  <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                  <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
              </div>
            </section>
          </>
        )}

        <footer>ClaimScope · AR Denial Analytics</footer>
      </main>
    </div>
  );
}

export default App;
