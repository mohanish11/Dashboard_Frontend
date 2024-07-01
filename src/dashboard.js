import React, { useEffect, useState } from 'react';
import { Bar, Radar, Line, Doughnut } from 'react-chartjs-2';
import {
  Container, Grid, Paper, Typography, Box, IconButton, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import 'chart.js/auto';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState({
    endYear: '',
    topics: '',
    sector: '',
    region: '',
    pest: '',
    source: '',
    country: '',
  });

  useEffect(() => {
    fetch('https://dashboard-backend-0t5x.onrender.com/api/data')
      .then(response => response.json())
      .then(data => {
        const filteredData = data.filter(item => 
          item.sector && item.topic && item.intensity > 0 && 
          item.likelihood > 0 && item.relevance > 0 && item.impact > 0
        );
        setData(filteredData);
      });
  }, [refresh]);

  const handleRefresh = () => {
    setRefresh(prev => !prev);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredData = data.filter(item => {
    return (
      (!filters.endYear || item.end_year === filters.endYear) &&
      (!filters.topics || item.topic === filters.topics) &&
      (!filters.sector || item.sector === filters.sector) &&
      (!filters.region || item.region === filters.region) &&
      (!filters.pest || item.pestle === filters.pest) &&
      (!filters.source || item.source === filters.source) &&
      (!filters.country || item.country === filters.country)
    );
  });

  const sectors = Array.from(new Set(filteredData.map(item => item.sector)));
  const topics = Array.from(new Set(filteredData.map(item => item.topic)));
  const regions = Array.from(new Set(filteredData.map(item => item.region)));
  const pests = Array.from(new Set(filteredData.map(item => item.pestle)));
  const sources = Array.from(new Set(filteredData.map(item => item.source)));
  const years = Array.from(new Set(filteredData.map(item => item.end_year)));

  // Aggregate intensity over time
  const intensityOverTimeData = filteredData.reduce((acc, item) => {
    const year = item.end_year;
    if (!acc[year]) {
      acc[year] = {
        intensitySum: 0,
        count: 0
      };
    }
    acc[year].intensitySum += item.intensity;
    acc[year].count++;
    return acc;
  }, {});

  const yearsForIntensityOverTime = Object.keys(intensityOverTimeData).sort();
  const intensityData = yearsForIntensityOverTime.map(year => ({
    year,
    averageIntensity: intensityOverTimeData[year].intensitySum / intensityOverTimeData[year].count
  }));

  // Chart data generation functions
  const getChartData = (category, categoryField) => {
    return {
      labels: category,
      datasets: [
        {
          label: 'Average Intensity',
          data: category.map(cat => {
            const items = filteredData.filter(item => item[categoryField] === cat);
            const avgIntensity = items.reduce((acc, item) => acc + item.intensity, 0) / items.length;
            return avgIntensity;
          }),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Average Likelihood',
          data: category.map(cat => {
            const items = filteredData.filter(item => item[categoryField] === cat);
            const avgLikelihood = items.reduce((acc, item) => acc + item.likelihood, 0) / items.length;
            return avgLikelihood;
          }),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
        {
          label: 'Average Relevance',
          data: category.map(cat => {
            const items = filteredData.filter(item => item[categoryField] === cat);
            const avgRelevance = items.reduce((acc, item) => acc + item.relevance, 0) / items.length;
            return avgRelevance;
          }),
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
        },
        {
          label: 'Average Impact',
          data: category.map(cat => {
            const items = filteredData.filter(item => item[categoryField] === cat);
            const avgImpact = items.reduce((acc, item) => acc + item.impact, 0) / items.length;
            return avgImpact;
          }),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    };
  };

  const sectorChartData = getChartData(sectors, 'sector');
  const topicChartData = getChartData(topics, 'topic');

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Dashboard</Typography>
        <IconButton color="primary" onClick={handleRefresh}>
          <RefreshIcon />
        </IconButton>
      </Box>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>End Year</InputLabel>
            <Select
              value={filters.endYear}
              name="endYear"
              onChange={handleFilterChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {years.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Topic</InputLabel>
            <Select
              value={filters.topics}
              name="topics"
              onChange={handleFilterChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {topics.map(topic => (
                <MenuItem key={topic} value={topic}>
                  {topic}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Sector</InputLabel>
            <Select
              value={filters.sector}
              name="sector"
              onChange={handleFilterChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {sectors.map(sector => (
                <MenuItem key={sector} value={sector}>
                  {sector}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Region</InputLabel>
            <Select
              value={filters.region}
              name="region"
              onChange={handleFilterChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {regions.map(region => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>PEST</InputLabel>
            <Select
              value={filters.pest}
              name="pest"
              onChange={handleFilterChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {pests.map(pest => (
                <MenuItem key={pest} value={pest}>
                  {pest}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Source</InputLabel>
            <Select
              value={filters.source}
              name="source"
              onChange={handleFilterChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {sources.map(source => (
                <MenuItem key={source} value={source}>
                  {source}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Removed SWOT and City filters */}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Average Intensity, Likelihood, Relevance, and Impact by Sector
            </Typography>
            <Bar data={sectorChartData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Average Intensity Over Time
            </Typography>
            <Line
              data={{
                labels: intensityData.map(item => item.year),
                datasets: [{
                  label: 'Intensity',
                  data: intensityData.map(item => item.averageIntensity),
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  fill: false,
                }],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Average Intensity, Likelihood, Relevance, and Impact by Topic
            </Typography>
            <Radar data={topicChartData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Impact Distribution by Sector
            </Typography>
            <Doughnut
              data={{
                labels: sectors,
                datasets: [{
                  label: 'Impact',
                  data: sectors.map(sector => {
                    const items = filteredData.filter(item => item.sector === sector);
                    const totalImpact = items.reduce((acc, item) => acc + item.impact, 0);
                    return totalImpact;
                  }),
                  backgroundColor: sectors.map((_, idx) => `rgba(${idx * 50 % 255}, ${idx * 80 % 255}, ${idx * 120 % 255}, 0.6)`),
                }],
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
