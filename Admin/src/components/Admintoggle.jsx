import React, { useEffect, useState } from 'react';
import { Switch, FormControlLabel, Typography, CircularProgress } from '@mui/material';
import { fetchDataFromApi, postData } from '../utils/api'; // adjust path if needed

const Admintoggle = () => {
  const [isClosed, setIsClosed] = useState(false);
  const [isBuyDisabled, setIsBuyDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const blockedRoles = ["shopkeeper", "guest"];
  const userRole = localStorage.getItem("name");

  useEffect(() => {
    fetchDataFromApi('/api/toggle/toggle')
      .then((res) => {
        setIsClosed(res.isClosed);
        setIsBuyDisabled(res.isBuyDisabled);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch toggle state:', err);
        setLoading(false);
      });
  }, []);

  const toggleWebsite = async () => {
    try {
      setUpdating(true);
      const res = await postData('/api/toggle/toggle', { isClosed: !isClosed });
      setIsClosed(res.isClosed);
    } catch (err) {
      console.error('Failed to update toggle state:', err);
    } finally {
      setUpdating(false);
    }
  };

  const toggleBuyButton = async () => {
    try {
      setUpdating(true);
      const res = await postData('/api/toggle/toggle', { isBuyDisabled: !isBuyDisabled });
      setIsBuyDisabled(res.isBuyDisabled);
    } catch (err) {
      console.error('Failed to update buy toggle:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading admin panel...</p>;

  if (!blockedRoles.includes(userRole)) {
    return (
      <div className="max-w-full m-3 p-2 border rounded-lg shadow bg-white">
        <h1 className="text-xl font-bold mb-3 p-2">Admin Control Panel</h1>

        <div className="border-2 border-black rounded-md border-opacity-10 p-3 space-y-4">
          {/* Toggle Website */}
          <div className="flex items-center justify-between">
            <Typography variant="body1">
              3D page:{" "}
              <span className={`font-semibold px-1 ${isClosed ? 'text-red-600' : 'text-green-600'}`}>
                {isClosed ? 'Closed' : 'Open'}
              </span>
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={!isClosed}
                  onChange={toggleWebsite}
                  disabled={updating}
                  color="warning"
                />
              }
            />
          </div>

          {/* Toggle Buy Button */}
          <div className="flex items-center justify-between">
            <Typography variant="body1">
              Buy Button is:{" "}
              <span
                className={`font-semibold px-1 ${isBuyDisabled ? 'text-red-600' : 'text-green-600'
                  }`}
              >
                {isBuyDisabled ? 'Disabled (Coming Soon)' : 'Enabled'}
              </span>
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={!isBuyDisabled}
                  onChange={toggleBuyButton}
                  disabled={updating}
                  color="secondary"
                />
              }
            />
          </div>
        </div>

        {updating && (
          <div className="mt-4 flex justify-center">
            <CircularProgress size={24} />
          </div>
        )}
      </div>
    );
  }
  };

  export default Admintoggle;
