import './Progress.scss';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = {
  'default': 'rgba(255, 255, 255, 0.25)',
  'arrived': '#FFE65C',
  'progress': '#FF347B',
  'left': '#00C49F',
}
export default function Progress(props) {

  const data = [];
  const colors = [];
  let result = 1000;
  props.data.map((v, i) => {
    data.push({name: v.name, value: 1, number: v.number });
    colors.push(COLORS[v.state || 'default']);
      result -= (parseFloat(v.points || 0) * parseFloat(v.multiplier || 1));
      result -= parseFloat(v.penalty || 0);
    return null;
  });

  const RADIAN = Math.PI / 180;
  const drawLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = outerRadius + 10;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const nangle = 360 - (midAngle + 270);

    let horiz = 'start';

    if (nangle > 180)
      horiz = 'end';

    return (
      <text x={ x } y={ y } fill="white" dominantBaseline="central" textAnchor={ horiz }>
        S{ data[index].number }
      </text>
    );
  };

  return (
    <div className="Progress">
      <ResponsiveContainer>
        <PieChart width={240} height={240}>
          <Pie
            dataKey="value"
            nameKey="name"
            data={ data }
            label={ drawLabel }
            cx="50%"
            cy="50%"
            outerRadius={ 80 }
            innerRadius={ 70 }
            paddingAngle={2}
            startAngle={ 90 }
            endAngle={ -270 }
            labelLine={ false }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="transparent" />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="result">
        <span className="value">{ result }</span>
        <span className="label">Punkte</span>
      </div>
    </div>
  )
}
