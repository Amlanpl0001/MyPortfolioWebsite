import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DbPlayground = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  // State for active schema
  const [activeSchema, setActiveSchema] = useState('ecommerce');
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState(null);

  // Sample database schemas
  const schemas = [
    { id: 'ecommerce', name: 'E-commerce Database' },
    { id: 'hr', name: 'HR Database' },
    { id: 'library', name: 'Library Database' },
    { id: 'analytics', name: 'Analytics Database' },
  ];

  // Sample queries for each schema
  const sampleQueries = {
    analytics: [
      {
        name: 'Basic website analytics',
        query: 'SELECT * FROM page_views LIMIT 10;'
      },
      {
        name: 'User session analysis with window functions',
        query: `WITH user_sessions AS (
  SELECT
    user_id,
    session_id,
    MIN(timestamp) AS session_start,
    MAX(timestamp) AS session_end,
    COUNT(*) AS page_view_count,
    COUNT(DISTINCT page_path) AS unique_pages_viewed,
    SUM(CASE WHEN event_type = 'click' THEN 1 ELSE 0 END) AS click_count,
    SUM(CASE WHEN event_type = 'scroll' THEN 1 ELSE 0 END) AS scroll_count,
    MAX(CASE WHEN page_path = '/checkout/complete' THEN 1 ELSE 0 END) AS converted
  FROM
    events
  WHERE
    timestamp BETWEEN '2023-03-01' AND '2023-03-31'
  GROUP BY
    user_id, session_id
)
SELECT
  user_id,
  session_id,
  session_start,
  session_end,
  TIMESTAMPDIFF(SECOND, session_start, session_end) AS session_duration_seconds,
  page_view_count,
  unique_pages_viewed,
  click_count,
  scroll_count,
  converted,
  -- Window functions for user-level analysis
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY session_start) AS session_number,
  LAG(session_start) OVER (PARTITION BY user_id ORDER BY session_start) AS previous_session_start,
  TIMESTAMPDIFF(
    HOUR,
    LAG(session_end) OVER (PARTITION BY user_id ORDER BY session_start),
    session_start
  ) AS hours_since_last_session,
  AVG(page_view_count) OVER (PARTITION BY user_id) AS avg_page_views_per_session,
  SUM(converted) OVER (PARTITION BY user_id) AS total_conversions,
  -- Percentile calculations
  PERCENT_RANK() OVER (ORDER BY page_view_count) AS page_view_percentile,
  PERCENT_RANK() OVER (ORDER BY TIMESTAMPDIFF(SECOND, session_start, session_end)) AS duration_percentile
FROM
  user_sessions
WHERE
  TIMESTAMPDIFF(SECOND, session_start, session_end) > 10
ORDER BY
  user_id, session_start
LIMIT 100;`
      },
      {
        name: 'Funnel analysis with conversion rates',
        query: `WITH funnel_steps AS (
  SELECT
    user_id,
    session_id,
    MAX(CASE WHEN page_path = '/products' THEN 1 ELSE 0 END) AS viewed_products,
    MAX(CASE WHEN page_path = '/product/detail' THEN 1 ELSE 0 END) AS viewed_product_detail,
    MAX(CASE WHEN page_path = '/cart' THEN 1 ELSE 0 END) AS viewed_cart,
    MAX(CASE WHEN page_path = '/checkout' THEN 1 ELSE 0 END) AS started_checkout,
    MAX(CASE WHEN page_path = '/checkout/payment' THEN 1 ELSE 0 END) AS entered_payment,
    MAX(CASE WHEN page_path = '/checkout/complete' THEN 1 ELSE 0 END) AS completed_purchase,
    MIN(CASE WHEN page_path = '/products' THEN timestamp ELSE NULL END) AS products_time,
    MIN(CASE WHEN page_path = '/product/detail' THEN timestamp ELSE NULL END) AS detail_time,
    MIN(CASE WHEN page_path = '/cart' THEN timestamp ELSE NULL END) AS cart_time,
    MIN(CASE WHEN page_path = '/checkout' THEN timestamp ELSE NULL END) AS checkout_time,
    MIN(CASE WHEN page_path = '/checkout/payment' THEN timestamp ELSE NULL END) AS payment_time,
    MIN(CASE WHEN page_path = '/checkout/complete' THEN timestamp ELSE NULL END) AS purchase_time
  FROM
    events
  WHERE
    timestamp BETWEEN '2023-03-01' AND '2023-03-31'
    AND event_type = 'pageview'
  GROUP BY
    user_id, session_id
),
funnel_metrics AS (
  SELECT
    COUNT(*) AS total_sessions,
    SUM(viewed_products) AS products_count,
    SUM(viewed_product_detail) AS detail_count,
    SUM(viewed_cart) AS cart_count,
    SUM(started_checkout) AS checkout_count,
    SUM(entered_payment) AS payment_count,
    SUM(completed_purchase) AS purchase_count
  FROM
    funnel_steps
),
step_conversion AS (
  SELECT
    'Products Page' AS step_name,
    products_count AS step_count,
    products_count / total_sessions * 100 AS overall_conversion_rate,
    100 AS step_conversion_rate,
    1 AS step_order
  FROM
    funnel_metrics

  UNION ALL

  SELECT
    'Product Detail' AS step_name,
    detail_count AS step_count,
    detail_count / total_sessions * 100 AS overall_conversion_rate,
    detail_count / products_count * 100 AS step_conversion_rate,
    2 AS step_order
  FROM
    funnel_metrics

  UNION ALL

  SELECT
    'Cart' AS step_name,
    cart_count AS step_count,
    cart_count / total_sessions * 100 AS overall_conversion_rate,
    cart_count / detail_count * 100 AS step_conversion_rate,
    3 AS step_order
  FROM
    funnel_metrics

  UNION ALL

  SELECT
    'Checkout' AS step_name,
    checkout_count AS step_count,
    checkout_count / total_sessions * 100 AS overall_conversion_rate,
    checkout_count / cart_count * 100 AS step_conversion_rate,
    4 AS step_order
  FROM
    funnel_metrics

  UNION ALL

  SELECT
    'Payment' AS step_name,
    payment_count AS step_count,
    payment_count / total_sessions * 100 AS overall_conversion_rate,
    payment_count / checkout_count * 100 AS step_conversion_rate,
    5 AS step_order
  FROM
    funnel_metrics

  UNION ALL

  SELECT
    'Purchase Complete' AS step_name,
    purchase_count AS step_count,
    purchase_count / total_sessions * 100 AS overall_conversion_rate,
    purchase_count / payment_count * 100 AS step_conversion_rate,
    6 AS step_order
  FROM
    funnel_metrics
)
SELECT
  step_name,
  step_count,
  ROUND(overall_conversion_rate, 2) AS overall_conversion_pct,
  ROUND(step_conversion_rate, 2) AS step_conversion_pct,
  CONCAT(
    REPEAT('█', FLOOR(step_conversion_rate / 5)),
    REPEAT('░', 20 - FLOOR(step_conversion_rate / 5))
  ) AS conversion_visualization
FROM
  step_conversion
ORDER BY
  step_order;`
      },
      {
        name: 'Cohort retention analysis',
        query: `WITH user_first_activity AS (
  SELECT
    user_id,
    DATE_FORMAT(MIN(timestamp), '%Y-%m-01') AS cohort_date
  FROM
    events
  GROUP BY
    user_id
),
user_monthly_activity AS (
  SELECT
    e.user_id,
    DATE_FORMAT(e.timestamp, '%Y-%m-01') AS activity_month,
    COUNT(DISTINCT e.session_id) AS session_count
  FROM
    events e
  GROUP BY
    e.user_id, activity_month
),
cohort_size AS (
  SELECT
    cohort_date,
    COUNT(DISTINCT user_id) AS users
  FROM
    user_first_activity
  GROUP BY
    cohort_date
),
cohort_activity AS (
  SELECT
    ufa.cohort_date,
    uma.activity_month,
    PERIOD_DIFF(
      EXTRACT(YEAR_MONTH FROM uma.activity_month),
      EXTRACT(YEAR_MONTH FROM ufa.cohort_date)
    ) AS month_number,
    COUNT(DISTINCT uma.user_id) AS active_users
  FROM
    user_first_activity ufa
  JOIN
    user_monthly_activity uma ON ufa.user_id = uma.user_id
  GROUP BY
    ufa.cohort_date, uma.activity_month, month_number
)
SELECT
  ca.cohort_date,
  cs.users AS cohort_size,
  ca.month_number,
  ca.active_users,
  ROUND(ca.active_users / cs.users * 100, 2) AS retention_rate,
  CONCAT(
    REPEAT('█', FLOOR(ca.active_users / cs.users * 20)),
    REPEAT('░', 20 - FLOOR(ca.active_users / cs.users * 20))
  ) AS retention_visualization
FROM
  cohort_activity ca
JOIN
  cohort_size cs ON ca.cohort_date = cs.cohort_date
WHERE
  ca.cohort_date >= '2023-01-01'
  AND ca.month_number <= 6
ORDER BY
  ca.cohort_date, ca.month_number;`
      },
      {
        name: 'Recursive CTE for user journey paths',
        query: `WITH RECURSIVE user_paths AS (
  -- Anchor: Starting points (entry pages)
  SELECT
    session_id,
    user_id,
    page_path AS current_path,
    page_path AS path,
    timestamp AS entry_time,
    timestamp AS current_time,
    1 AS path_length,
    event_id
  FROM
    events
  WHERE
    event_type = 'pageview'
    AND timestamp BETWEEN '2023-03-01' AND '2023-03-31'
    AND NOT EXISTS (
      SELECT 1
      FROM events e2
      WHERE e2.session_id = events.session_id
        AND e2.timestamp < events.timestamp
        AND e2.event_type = 'pageview'
    )

  UNION ALL

  -- Recursive part: Follow the path to the next page
  SELECT
    e.session_id,
    e.user_id,
    e.page_path AS current_path,
    CONCAT(up.path, ' → ', e.page_path) AS path,
    up.entry_time,
    e.timestamp AS current_time,
    up.path_length + 1 AS path_length,
    e.event_id
  FROM
    events e
  JOIN
    user_paths up ON e.session_id = up.session_id
      AND e.timestamp > up.current_time
      AND e.event_type = 'pageview'
  WHERE
    e.timestamp = (
      SELECT MIN(timestamp)
      FROM events e2
      WHERE e2.session_id = up.session_id
        AND e2.timestamp > up.current_time
        AND e2.event_type = 'pageview'
    )
    AND up.path_length < 10  -- Limit path depth to avoid infinite recursion
),
path_metrics AS (
  SELECT
    path,
    COUNT(DISTINCT session_id) AS session_count,
    AVG(path_length) AS avg_path_length,
    COUNT(DISTINCT user_id) AS unique_users,
    COUNT(DISTINCT CASE WHEN current_path = '/checkout/complete' THEN session_id ELSE NULL END) AS converted_sessions
  FROM
    user_paths
  GROUP BY
    path
)
SELECT
  path,
  session_count,
  unique_users,
  converted_sessions,
  ROUND(converted_sessions / session_count * 100, 2) AS conversion_rate,
  ROUND(avg_path_length, 2) AS avg_path_length
FROM
  path_metrics
WHERE
  session_count >= 10
ORDER BY
  session_count DESC
LIMIT 20;`
      },
      {
        name: 'JSON operations and dynamic pivot',
        query: `WITH event_properties AS (
  SELECT
    event_id,
    user_id,
    session_id,
    event_type,
    timestamp,
    page_path,
    -- Extract properties from JSON
    JSON_VALUE(properties, '$.device_type') AS device_type,
    JSON_VALUE(properties, '$.browser') AS browser,
    JSON_VALUE(properties, '$.os') AS operating_system,
    JSON_VALUE(properties, '$.screen_size') AS screen_size,
    JSON_VALUE(properties, '$.referrer') AS referrer,
    CASE
      WHEN JSON_VALUE(properties, '$.utm_source') IS NOT NULL THEN JSON_VALUE(properties, '$.utm_source')
      ELSE 'direct'
    END AS traffic_source,
    CASE
      WHEN event_type = 'click' THEN JSON_VALUE(properties, '$.element_id')
      ELSE NULL
    END AS clicked_element,
    CASE
      WHEN event_type = 'form_submit' THEN JSON_VALUE(properties, '$.form_id')
      ELSE NULL
    END AS submitted_form
  FROM
    events
  WHERE
    timestamp BETWEEN '2023-03-01' AND '2023-03-31'
),
device_metrics AS (
  SELECT
    device_type,
    COUNT(DISTINCT user_id) AS unique_users,
    COUNT(DISTINCT session_id) AS sessions,
    COUNT(*) AS events,
    COUNT(DISTINCT CASE WHEN page_path = '/checkout/complete' THEN session_id ELSE NULL END) AS conversions,
    COUNT(DISTINCT CASE WHEN page_path = '/checkout/complete' THEN session_id ELSE NULL END) / 
      COUNT(DISTINCT session_id) * 100 AS conversion_rate
  FROM
    event_properties
  GROUP BY
    device_type
),
browser_metrics AS (
  SELECT
    browser,
    COUNT(DISTINCT user_id) AS unique_users,
    COUNT(DISTINCT session_id) AS sessions,
    COUNT(*) AS events,
    COUNT(DISTINCT CASE WHEN page_path = '/checkout/complete' THEN session_id ELSE NULL END) AS conversions,
    COUNT(DISTINCT CASE WHEN page_path = '/checkout/complete' THEN session_id ELSE NULL END) / 
      COUNT(DISTINCT session_id) * 100 AS conversion_rate
  FROM
    event_properties
  GROUP BY
    browser
),
traffic_metrics AS (
  SELECT
    traffic_source,
    COUNT(DISTINCT user_id) AS unique_users,
    COUNT(DISTINCT session_id) AS sessions,
    COUNT(*) AS events,
    COUNT(DISTINCT CASE WHEN page_path = '/checkout/complete' THEN session_id ELSE NULL END) AS conversions,
    COUNT(DISTINCT CASE WHEN page_path = '/checkout/complete' THEN session_id ELSE NULL END) / 
      COUNT(DISTINCT session_id) * 100 AS conversion_rate
  FROM
    event_properties
  GROUP BY
    traffic_source
),
-- Dynamic pivot for page views by device type and hour of day
hourly_device_pageviews AS (
  SELECT
    HOUR(timestamp) AS hour_of_day,
    device_type,
    COUNT(*) AS pageviews
  FROM
    event_properties
  WHERE
    event_type = 'pageview'
  GROUP BY
    hour_of_day, device_type
),
pivot_data AS (
  SELECT
    hour_of_day,
    SUM(CASE WHEN device_type = 'desktop' THEN pageviews ELSE 0 END) AS desktop,
    SUM(CASE WHEN device_type = 'mobile' THEN pageviews ELSE 0 END) AS mobile,
    SUM(CASE WHEN device_type = 'tablet' THEN pageviews ELSE 0 END) AS tablet,
    SUM(pageviews) AS total
  FROM
    hourly_device_pageviews
  GROUP BY
    hour_of_day
)
-- Final output with all metrics
SELECT
  'Device Type Metrics' AS report_section,
  JSON_OBJECT(
    'device_type', device_type,
    'unique_users', unique_users,
    'sessions', sessions,
    'events', events,
    'conversions', conversions,
    'conversion_rate', ROUND(conversion_rate, 2)
  ) AS metrics
FROM
  device_metrics

UNION ALL

SELECT
  'Browser Metrics' AS report_section,
  JSON_OBJECT(
    'browser', browser,
    'unique_users', unique_users,
    'sessions', sessions,
    'events', events,
    'conversions', conversions,
    'conversion_rate', ROUND(conversion_rate, 2)
  ) AS metrics
FROM
  browser_metrics

UNION ALL

SELECT
  'Traffic Source Metrics' AS report_section,
  JSON_OBJECT(
    'traffic_source', traffic_source,
    'unique_users', unique_users,
    'sessions', sessions,
    'events', events,
    'conversions', conversions,
    'conversion_rate', ROUND(conversion_rate, 2)
  ) AS metrics
FROM
  traffic_metrics

UNION ALL

SELECT
  'Hourly Device Pageviews' AS report_section,
  JSON_OBJECT(
    'hour_of_day', hour_of_day,
    'desktop', desktop,
    'mobile', mobile,
    'tablet', tablet,
    'total', total,
    'desktop_pct', ROUND(desktop / total * 100, 2),
    'mobile_pct', ROUND(mobile / total * 100, 2),
    'tablet_pct', ROUND(tablet / total * 100, 2)
  ) AS metrics
FROM
  pivot_data
ORDER BY
  report_section, metrics->'$.hour_of_day', metrics->'$.device_type', metrics->'$.browser', metrics->'$.traffic_source';`
      }
    ],
    ecommerce: [
      {
        name: 'List all products',
        query: 'SELECT * FROM products;'
      },
      {
        name: 'Find products with price > $500',
        query: 'SELECT name, price, category FROM products WHERE price > 500 ORDER BY price DESC;'
      },
      {
        name: 'Count products by category',
        query: 'SELECT category, COUNT(*) as product_count FROM products GROUP BY category;'
      },
      {
        name: 'Product sales analysis',
        query: `SELECT 
  p.id, 
  p.name, 
  p.category,
  p.price,
  COUNT(oi.id) AS total_orders,
  SUM(oi.quantity) AS total_quantity_sold,
  SUM(oi.quantity * oi.unit_price) AS total_revenue,
  AVG(r.rating) AS average_rating,
  COUNT(r.id) AS review_count
FROM 
  products p
LEFT JOIN 
  order_items oi ON p.id = oi.product_id
LEFT JOIN 
  orders o ON oi.order_id = o.id
LEFT JOIN 
  reviews r ON p.id = r.product_id
WHERE 
  o.status = 'completed'
  AND o.order_date BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) AND CURRENT_DATE()
GROUP BY 
  p.id, p.name, p.category, p.price
HAVING 
  total_quantity_sold > 10
ORDER BY 
  total_revenue DESC
LIMIT 20;`
      },
      {
        name: 'Customer segmentation',
        query: `WITH customer_stats AS (
  SELECT 
    c.id,
    c.email,
    c.first_name,
    c.last_name,
    c.created_at,
    COUNT(DISTINCT o.id) AS order_count,
    SUM(o.total_amount) AS total_spent,
    MAX(o.order_date) AS last_order_date,
    DATEDIFF(CURRENT_DATE(), MAX(o.order_date)) AS days_since_last_order,
    AVG(o.total_amount) AS avg_order_value
  FROM 
    customers c
  LEFT JOIN 
    orders o ON c.id = o.customer_id
  WHERE 
    o.status = 'completed'
  GROUP BY 
    c.id, c.email, c.first_name, c.last_name, c.created_at
),
customer_segments AS (
  SELECT 
    *,
    CASE
      WHEN order_count >= 5 AND days_since_last_order <= 90 THEN 'loyal'
      WHEN order_count >= 2 AND days_since_last_order <= 180 THEN 'regular'
      WHEN days_since_last_order > 180 THEN 'at_risk'
      WHEN days_since_last_order IS NULL THEN 'inactive'
      ELSE 'new'
    END AS customer_segment,
    NTILE(5) OVER (ORDER BY total_spent DESC) AS spending_quintile
  FROM 
    customer_stats
)
SELECT 
  customer_segment,
  spending_quintile,
  COUNT(*) AS customer_count,
  ROUND(AVG(total_spent), 2) AS avg_total_spent,
  ROUND(AVG(avg_order_value), 2) AS avg_order_value,
  ROUND(AVG(order_count), 2) AS avg_order_count
FROM 
  customer_segments
GROUP BY 
  customer_segment, spending_quintile
ORDER BY 
  customer_segment, spending_quintile;`
      },
      {
        name: 'Product recommendation',
        query: `WITH product_pairs AS (
  SELECT 
    oi1.product_id AS product_1,
    oi2.product_id AS product_2,
    COUNT(DISTINCT oi1.order_id) AS co_occurrence_count
  FROM 
    order_items oi1
  JOIN 
    order_items oi2 ON oi1.order_id = oi2.order_id AND oi1.product_id < oi2.product_id
  GROUP BY 
    oi1.product_id, oi2.product_id
  HAVING 
    co_occurrence_count >= 5
)
SELECT 
  p1.name AS product_name,
  p2.name AS recommended_product,
  pp.co_occurrence_count,
  ROUND(
    (pp.co_occurrence_count * 100.0) / 
    (SELECT COUNT(DISTINCT order_id) FROM order_items WHERE product_id = p1.id),
    2
  ) AS recommendation_strength
FROM 
  product_pairs pp
JOIN 
  products p1 ON pp.product_1 = p1.id
JOIN 
  products p2 ON pp.product_2 = p2.id
WHERE 
  p1.id = 3  -- Replace with the product ID you want recommendations for
ORDER BY 
  recommendation_strength DESC
LIMIT 5;`
      },
      {
        name: 'Inventory management',
        query: `SELECT 
  p.id,
  p.name,
  p.sku,
  p.category,
  i.quantity_in_stock,
  i.reorder_level,
  i.reorder_quantity,
  i.last_restock_date,
  CASE
    WHEN i.quantity_in_stock <= i.reorder_level THEN 'Reorder needed'
    WHEN i.quantity_in_stock <= i.reorder_level * 2 THEN 'Low stock'
    ELSE 'In stock'
  END AS stock_status,
  COALESCE(
    (SELECT SUM(oi.quantity) 
     FROM order_items oi 
     JOIN orders o ON oi.order_id = o.id 
     WHERE oi.product_id = p.id 
     AND o.order_date BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) AND CURRENT_DATE()),
    0
  ) AS units_sold_last_30_days,
  COALESCE(
    (SELECT SUM(oi.quantity) 
     FROM order_items oi 
     JOIN orders o ON oi.order_id = o.id 
     WHERE oi.product_id = p.id 
     AND o.order_date BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) AND CURRENT_DATE()),
    0
  ) / 3 AS avg_monthly_demand,
  CASE
    WHEN i.quantity_in_stock = 0 THEN NULL
    ELSE ROUND(i.quantity_in_stock / 
      NULLIF(
        (SELECT SUM(oi.quantity) 
         FROM order_items oi 
         JOIN orders o ON oi.order_id = o.id 
         WHERE oi.product_id = p.id 
         AND o.order_date BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) AND CURRENT_DATE()) / 90,
        0
      ),
      0
    )
  END AS estimated_days_until_stockout
FROM 
  products p
JOIN 
  inventory i ON p.id = i.product_id
ORDER BY 
  stock_status ASC,
  estimated_days_until_stockout ASC;`
      }
    ],
    hr: [
      {
        name: 'List all employees',
        query: 'SELECT * FROM employees;'
      },
      {
        name: 'Employees by department',
        query: 'SELECT e.id, e.first_name, e.last_name, d.name as department FROM employees e JOIN departments d ON e.department_id = d.id ORDER BY d.name, e.last_name;'
      },
      {
        name: 'Salary analysis by department',
        query: `SELECT 
  d.name AS department,
  COUNT(e.id) AS employee_count,
  ROUND(AVG(s.amount), 2) AS avg_salary,
  ROUND(MIN(s.amount), 2) AS min_salary,
  ROUND(MAX(s.amount), 2) AS max_salary,
  ROUND(STDDEV(s.amount), 2) AS salary_stddev,
  ROUND(
    (MAX(s.amount) - MIN(s.amount)) / MIN(s.amount) * 100,
    2
  ) AS salary_range_percentage
FROM 
  employees e
JOIN 
  departments d ON e.department_id = d.id
JOIN 
  salaries s ON e.id = s.employee_id
WHERE 
  s.end_date IS NULL OR s.end_date > CURRENT_DATE()
GROUP BY 
  d.name
ORDER BY 
  avg_salary DESC;`
      },
      {
        name: 'Employee tenure and promotion analysis',
        query: `WITH employee_positions AS (
  SELECT 
    e.id,
    e.first_name,
    e.last_name,
    e.hire_date,
    d.name AS department,
    jp.title AS position,
    jp.start_date,
    jp.end_date,
    DATEDIFF(
      COALESCE(jp.end_date, CURRENT_DATE()),
      jp.start_date
    ) AS days_in_position,
    ROW_NUMBER() OVER (
      PARTITION BY e.id 
      ORDER BY jp.start_date
    ) AS position_number,
    COUNT(*) OVER (
      PARTITION BY e.id
    ) AS total_positions
  FROM 
    employees e
  JOIN 
    departments d ON e.department_id = d.id
  JOIN 
    job_positions jp ON e.id = jp.employee_id
  WHERE 
    e.termination_date IS NULL
)
SELECT 
  id,
  first_name,
  last_name,
  department,
  DATEDIFF(CURRENT_DATE(), hire_date) / 365.0 AS years_at_company,
  total_positions - 1 AS number_of_promotions,
  (total_positions - 1) / (DATEDIFF(CURRENT_DATE(), hire_date) / 365.0) AS promotions_per_year,
  (
    SELECT position 
    FROM employee_positions ep2 
    WHERE ep2.id = ep.id 
    ORDER BY start_date DESC 
    LIMIT 1
  ) AS current_position,
  (
    SELECT days_in_position 
    FROM employee_positions ep2 
    WHERE ep2.id = ep.id 
    ORDER BY start_date DESC 
    LIMIT 1
  ) / 365.0 AS years_in_current_position
FROM 
  employee_positions ep
WHERE 
  position_number = 1
GROUP BY 
  id, first_name, last_name, department, hire_date, total_positions
HAVING 
  years_at_company >= 2
ORDER BY 
  promotions_per_year DESC, years_at_company DESC;`
      },
      {
        name: 'Employee performance and compensation correlation',
        query: `SELECT 
  e.id,
  e.first_name,
  e.last_name,
  d.name AS department,
  jp.title AS position,
  ROUND(AVG(pr.score), 2) AS avg_performance_score,
  COUNT(pr.id) AS review_count,
  ROUND(s.amount, 2) AS current_salary,
  ROUND(
    (s.amount - (
      SELECT s2.amount
      FROM salaries s2
      WHERE s2.employee_id = e.id
      AND s2.start_date < s.start_date
      ORDER BY s2.start_date DESC
      LIMIT 1
    )) / (
      SELECT s2.amount
      FROM salaries s2
      WHERE s2.employee_id = e.id
      AND s2.start_date < s.start_date
      ORDER BY s2.start_date DESC
      LIMIT 1
    ) * 100,
    2
  ) AS last_raise_percentage,
  ROUND(
    (
      SELECT AVG(s2.amount)
      FROM employees e2
      JOIN salaries s2 ON e2.id = s2.employee_id
      JOIN job_positions jp2 ON e2.id = jp2.employee_id
      WHERE jp2.title = jp.title
      AND (s2.end_date IS NULL OR s2.end_date > CURRENT_DATE())
      AND e2.id != e.id
    ),
    2
  ) AS position_avg_salary,
  ROUND(
    (s.amount - (
      SELECT AVG(s2.amount)
      FROM employees e2
      JOIN salaries s2 ON e2.id = s2.employee_id
      JOIN job_positions jp2 ON e2.id = jp2.employee_id
      WHERE jp2.title = jp.title
      AND (s2.end_date IS NULL OR s2.end_date > CURRENT_DATE())
      AND e2.id != e.id
    )) / (
      SELECT AVG(s2.amount)
      FROM employees e2
      JOIN salaries s2 ON e2.id = s2.employee_id
      JOIN job_positions jp2 ON e2.id = jp2.employee_id
      WHERE jp2.title = jp.title
      AND (s2.end_date IS NULL OR s2.end_date > CURRENT_DATE())
      AND e2.id != e.id
    ) * 100,
    2
  ) AS salary_vs_position_avg_percentage
FROM 
  employees e
JOIN 
  departments d ON e.department_id = d.id
JOIN 
  job_positions jp ON e.id = jp.employee_id
JOIN 
  performance_reviews pr ON e.id = pr.employee_id
JOIN 
  salaries s ON e.id = s.employee_id
WHERE 
  e.termination_date IS NULL
  AND (jp.end_date IS NULL OR jp.end_date > CURRENT_DATE())
  AND (s.end_date IS NULL OR s.end_date > CURRENT_DATE())
  AND pr.review_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 2 YEAR)
GROUP BY 
  e.id, e.first_name, e.last_name, d.name, jp.title, s.amount
ORDER BY 
  avg_performance_score DESC;`
      }
    ],
    library: [
      {
        name: 'List all books',
        query: 'SELECT * FROM books;'
      },
      {
        name: 'Books by author',
        query: 'SELECT b.title, b.publication_year, a.name as author FROM books b JOIN book_authors ba ON b.id = ba.book_id JOIN authors a ON ba.author_id = a.id ORDER BY a.name, b.publication_year;'
      },
      {
        name: 'Popular books analysis',
        query: `SELECT 
  b.id,
  b.title,
  b.publication_year,
  b.publisher,
  GROUP_CONCAT(DISTINCT a.name ORDER BY a.name SEPARATOR ', ') AS authors,
  COUNT(DISTINCT l.id) AS total_loans,
  ROUND(AVG(DATEDIFF(l.return_date, l.checkout_date)), 1) AS avg_loan_duration,
  COUNT(DISTINCT r.id) AS review_count,
  ROUND(AVG(r.rating), 2) AS avg_rating,
  COUNT(DISTINCT CASE WHEN l.checkout_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) THEN l.id END) AS loans_last_90_days,
  (
    SELECT COUNT(*)
    FROM loan_waitlists lw
    WHERE lw.book_id = b.id
    AND lw.fulfilled_date IS NULL
  ) AS current_waitlist_count
FROM 
  books b
JOIN 
  book_authors ba ON b.id = ba.book_id
JOIN 
  authors a ON ba.author_id = a.id
LEFT JOIN 
  loans l ON b.id = l.book_id
LEFT JOIN 
  reviews r ON b.id = r.book_id
GROUP BY 
  b.id, b.title, b.publication_year, b.publisher
HAVING 
  total_loans > 10
ORDER BY 
  loans_last_90_days DESC, avg_rating DESC
LIMIT 20;`
      },
      {
        name: 'Reader behavior analysis',
        query: `WITH reader_stats AS (
  SELECT 
    m.id,
    m.first_name,
    m.last_name,
    m.email,
    m.join_date,
    COUNT(DISTINCT l.id) AS total_loans,
    COUNT(DISTINCT l.book_id) AS unique_books_borrowed,
    ROUND(AVG(DATEDIFF(l.return_date, l.checkout_date)), 1) AS avg_loan_duration,
    MAX(l.checkout_date) AS last_checkout_date,
    DATEDIFF(CURRENT_DATE(), MAX(l.checkout_date)) AS days_since_last_checkout,
    COUNT(DISTINCT CASE WHEN l.checkout_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) THEN l.id END) AS loans_last_90_days,
    COUNT(DISTINCT CASE WHEN l.return_date > l.due_date THEN l.id END) AS overdue_returns,
    ROUND(
      COUNT(DISTINCT CASE WHEN l.return_date > l.due_date THEN l.id END) * 100.0 / 
      NULLIF(COUNT(DISTINCT CASE WHEN l.return_date IS NOT NULL THEN l.id END), 0),
      2
    ) AS overdue_percentage,
    SUM(f.amount) AS total_fines
  FROM 
    members m
  LEFT JOIN 
    loans l ON m.id = l.member_id
  LEFT JOIN 
    fines f ON l.id = f.loan_id
  WHERE 
    m.active = 1
  GROUP BY 
    m.id, m.first_name, m.last_name, m.email, m.join_date
),
genre_preferences AS (
  SELECT 
    m.id AS member_id,
    g.name AS genre,
    COUNT(*) AS loan_count,
    ROW_NUMBER() OVER (PARTITION BY m.id ORDER BY COUNT(*) DESC) AS preference_rank
  FROM 
    members m
  JOIN 
    loans l ON m.id = l.member_id
  JOIN 
    book_genres bg ON l.book_id = bg.book_id
  JOIN 
    genres g ON bg.genre_id = g.id
  GROUP BY 
    m.id, g.name
)
SELECT 
  rs.id,
  rs.first_name,
  rs.last_name,
  rs.email,
  DATEDIFF(CURRENT_DATE(), rs.join_date) / 365.0 AS years_as_member,
  rs.total_loans,
  rs.unique_books_borrowed,
  rs.loans_last_90_days,
  rs.days_since_last_checkout,
  CASE
    WHEN rs.days_since_last_checkout <= 30 THEN 'Active'
    WHEN rs.days_since_last_checkout <= 90 THEN 'Recent'
    WHEN rs.days_since_last_checkout <= 180 THEN 'Lapsed'
    ELSE 'Inactive'
  END AS activity_status,
  rs.avg_loan_duration,
  rs.overdue_percentage,
  rs.total_fines,
  (
    SELECT GROUP_CONCAT(genre ORDER BY preference_rank SEPARATOR ', ')
    FROM genre_preferences gp
    WHERE gp.member_id = rs.id AND gp.preference_rank <= 3
  ) AS top_genres
FROM 
  reader_stats rs
ORDER BY 
  rs.loans_last_90_days DESC, rs.total_loans DESC
LIMIT 50;`
      },
      {
        name: 'Book recommendation engine',
        query: `WITH book_similarities AS (
  SELECT 
    l1.book_id AS book_1,
    l2.book_id AS book_2,
    COUNT(DISTINCT l1.member_id) AS common_readers,
    (
      SELECT COUNT(DISTINCT l3.member_id)
      FROM loans l3
      WHERE l3.book_id = l1.book_id
    ) AS book_1_readers,
    (
      SELECT COUNT(DISTINCT l4.member_id)
      FROM loans l4
      WHERE l4.book_id = l2.book_id
    ) AS book_2_readers,
    COUNT(DISTINCT l1.member_id) * 1.0 / 
    SQRT(
      (
        SELECT COUNT(DISTINCT l3.member_id)
        FROM loans l3
        WHERE l3.book_id = l1.book_id
      ) * 
      (
        SELECT COUNT(DISTINCT l4.member_id)
        FROM loans l4
        WHERE l4.book_id = l2.book_id
      )
    ) AS similarity_score
  FROM 
    loans l1
  JOIN 
    loans l2 ON l1.member_id = l2.member_id AND l1.book_id < l2.book_id
  GROUP BY 
    l1.book_id, l2.book_id
  HAVING 
    common_readers >= 3
),
member_genre_preferences AS (
  SELECT 
    l.member_id,
    g.id AS genre_id,
    g.name AS genre_name,
    COUNT(*) AS loan_count,
    ROW_NUMBER() OVER (PARTITION BY l.member_id ORDER BY COUNT(*) DESC) AS preference_rank
  FROM 
    loans l
  JOIN 
    book_genres bg ON l.book_id = bg.book_id
  JOIN 
    genres g ON bg.genre_id = g.id
  GROUP BY 
    l.member_id, g.id, g.name
)
SELECT 
  b.id,
  b.title,
  b.publication_year,
  GROUP_CONCAT(DISTINCT a.name ORDER BY a.name SEPARATOR ', ') AS authors,
  GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS genres,
  bs.similarity_score,
  ROUND(AVG(r.rating), 2) AS avg_rating,
  COUNT(DISTINCT r.id) AS review_count,
  (
    SELECT COUNT(*)
    FROM loans
    WHERE book_id = b.id
  ) AS total_loans,
  CASE
    WHEN b.id IN (
      SELECT DISTINCT book_id
      FROM loans
      WHERE member_id = 42  -- Replace with the member ID you want recommendations for
    ) THEN 'Already borrowed'
    ELSE 'Recommended'
  END AS status
FROM 
  book_similarities bs
JOIN 
  books b ON bs.book_2 = b.id
JOIN 
  book_authors ba ON b.id = ba.book_id
JOIN 
  authors a ON ba.author_id = a.id
JOIN 
  book_genres bg ON b.id = bg.book_id
JOIN 
  genres g ON bg.genre_id = g.id
LEFT JOIN 
  reviews r ON b.id = r.book_id
WHERE 
  bs.book_1 IN (
    SELECT book_id
    FROM loans
    WHERE member_id = 42  -- Replace with the member ID you want recommendations for
  )
  AND bs.book_2 NOT IN (
    SELECT book_id
    FROM loans
    WHERE member_id = 42  -- Replace with the member ID you want recommendations for
  )
  AND bs.similarity_score >= 0.2
  AND bg.genre_id IN (
    SELECT genre_id
    FROM member_genre_preferences
    WHERE member_id = 42  -- Replace with the member ID you want recommendations for
    AND preference_rank <= 3
  )
GROUP BY 
  b.id, b.title, b.publication_year, bs.similarity_score
ORDER BY 
  bs.similarity_score DESC, avg_rating DESC
LIMIT 10;`
      }
    ]
  };

  // Handle query execution
  const executeQuery = () => {
    if (!sqlQuery.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    setIsExecuting(true);
    setError(null);

    // In a real app, this would be an API call to execute the query
    // For now, simulate API call with mock data
    setTimeout(() => {
      try {
        // Check if query is a SELECT statement (for safety in this demo)
        const normalizedQuery = sqlQuery.trim().toLowerCase();
        if (!normalizedQuery.startsWith('select')) {
          throw new Error('Only SELECT queries are allowed in this playground');
        }

        // Generate mock results based on the query and schema
        let mockResults;

        if (activeSchema === 'ecommerce') {
          mockResults = {
            columns: ['id', 'name', 'price', 'category', 'in_stock'],
            rows: [
              [1, 'Laptop', 999.99, 'Electronics', true],
              [2, 'Smartphone', 699.99, 'Electronics', true],
              [3, 'Headphones', 149.99, 'Electronics', true],
              [4, 'T-shirt', 19.99, 'Clothing', true],
              [5, 'Jeans', 49.99, 'Clothing', false]
            ]
          };
        } else if (activeSchema === 'hr') {
          mockResults = {
            columns: ['id', 'first_name', 'last_name', 'job_title', 'department_id', 'salary'],
            rows: [
              [1, 'Alice', 'Johnson', 'Software Engineer', 1, 85000.00],
              [2, 'Bob', 'Smith', 'Product Manager', 2, 95000.00],
              [3, 'Carol', 'Williams', 'UX Designer', 1, 80000.00],
              [4, 'Dave', 'Brown', 'Marketing Specialist', 3, 75000.00],
              [5, 'Eve', 'Davis', 'HR Manager', 4, 90000.00]
            ]
          };
        } else if (activeSchema === 'library') {
          mockResults = {
            columns: ['id', 'title', 'isbn', 'publication_year', 'publisher', 'copies'],
            rows: [
              [1, 'The Great Gatsby', '9780743273565', 1925, 'Scribner', 3],
              [2, 'To Kill a Mockingbird', '9780061120084', 1960, 'HarperCollins', 5],
              [3, '1984', '9780451524935', 1949, 'Signet Classics', 4],
              [4, 'Pride and Prejudice', '9780141439518', 1813, 'Penguin Classics', 2],
              [5, 'The Hobbit', '9780547928227', 1937, 'Houghton Mifflin', 3]
            ]
          };
        } else if (activeSchema === 'analytics') {
          // Check which type of analytics query is being executed
          if (normalizedQuery.includes('user_session') || normalizedQuery.includes('window function')) {
            mockResults = {
              columns: ['user_id', 'session_id', 'session_start', 'session_end', 'session_duration_seconds', 'page_view_count', 'unique_pages_viewed', 'click_count', 'scroll_count', 'converted', 'session_number', 'hours_since_last_session', 'avg_page_views_per_session', 'total_conversions', 'page_view_percentile', 'duration_percentile'],
              rows: [
                ['user_123', 'sess_a1b2c3', '2023-03-01 08:12:34', '2023-03-01 08:25:12', 762, 8, 5, 12, 4, 1, 1, null, 7.5, 2, 0.68, 0.45],
                ['user_123', 'sess_d4e5f6', '2023-03-02 14:22:10', '2023-03-02 14:40:45', 1115, 12, 7, 18, 6, 1, 2, 30, 7.5, 2, 0.82, 0.72],
                ['user_456', 'sess_g7h8i9', '2023-03-01 10:05:22', '2023-03-01 10:12:18', 416, 5, 3, 7, 2, 0, 1, null, 5.0, 0, 0.35, 0.28],
                ['user_456', 'sess_j0k1l2', '2023-03-03 16:30:45', '2023-03-03 16:42:12', 687, 6, 4, 9, 3, 0, 2, 54, 5.0, 0, 0.42, 0.38],
                ['user_789', 'sess_m3n4o5', '2023-03-02 09:18:33', '2023-03-02 09:45:21', 1608, 15, 9, 22, 8, 1, 1, null, 15.0, 1, 0.95, 0.88]
              ]
            };
          } else if (normalizedQuery.includes('funnel') || normalizedQuery.includes('conversion')) {
            mockResults = {
              columns: ['step_name', 'step_count', 'overall_conversion_pct', 'step_conversion_pct', 'conversion_visualization'],
              rows: [
                ['Products Page', 5000, 100.00, 100.00, '████████████████████'],
                ['Product Detail', 3750, 75.00, 75.00, '███████████████░░░░░'],
                ['Cart', 2250, 45.00, 60.00, '████████████░░░░░░░░'],
                ['Checkout', 1500, 30.00, 66.67, '█████████████░░░░░░░'],
                ['Payment', 1125, 22.50, 75.00, '███████████████░░░░░'],
                ['Purchase Complete', 900, 18.00, 80.00, '████████████████░░░░']
              ]
            };
          } else if (normalizedQuery.includes('cohort') || normalizedQuery.includes('retention')) {
            mockResults = {
              columns: ['cohort_date', 'cohort_size', 'month_number', 'active_users', 'retention_rate', 'retention_visualization'],
              rows: [
                ['2023-01-01', 1200, 0, 1200, 100.00, '████████████████████'],
                ['2023-01-01', 1200, 1, 720, 60.00, '████████████░░░░░░░░'],
                ['2023-01-01', 1200, 2, 480, 40.00, '████████░░░░░░░░░░░░'],
                ['2023-01-01', 1200, 3, 360, 30.00, '██████░░░░░░░░░░░░░░'],
                ['2023-02-01', 1500, 0, 1500, 100.00, '████████████████████'],
                ['2023-02-01', 1500, 1, 825, 55.00, '███████████░░░░░░░░░'],
                ['2023-02-01', 1500, 2, 525, 35.00, '███████░░░░░░░░░░░░░'],
                ['2023-03-01', 1800, 0, 1800, 100.00, '████████████████████'],
                ['2023-03-01', 1800, 1, 990, 55.00, '███████████░░░░░░░░░']
              ]
            };
          } else if (normalizedQuery.includes('recursive') || normalizedQuery.includes('user_paths')) {
            mockResults = {
              columns: ['path', 'session_count', 'unique_users', 'converted_sessions', 'conversion_rate', 'avg_path_length'],
              rows: [
                ['Home → Products → Product Detail → Cart → Checkout → Payment → Complete', 450, 425, 450, 100.00, 7.00],
                ['Products → Product Detail → Cart → Checkout → Payment → Complete', 320, 310, 320, 100.00, 6.00],
                ['Home → Products → Product Detail → Cart', 280, 265, 0, 0.00, 4.00],
                ['Home → Search → Product Detail → Cart → Checkout → Payment → Complete', 130, 125, 130, 100.00, 7.00],
                ['Home → Products', 120, 115, 0, 0.00, 2.00]
              ]
            };
          } else if (normalizedQuery.includes('json') || normalizedQuery.includes('pivot')) {
            mockResults = {
              columns: ['report_section', 'metrics'],
              rows: [
                ['Device Type Metrics', '{"device_type":"desktop","unique_users":12500,"sessions":28750,"events":215000,"conversions":1250,"conversion_rate":10.00}'],
                ['Device Type Metrics', '{"device_type":"mobile","unique_users":18750,"sessions":35000,"events":245000,"conversions":1125,"conversion_rate":6.00}'],
                ['Device Type Metrics', '{"device_type":"tablet","unique_users":3750,"sessions":7500,"events":48750,"conversions":225,"conversion_rate":6.00}'],
                ['Browser Metrics', '{"browser":"Chrome","unique_users":20000,"sessions":42500,"events":297500,"conversions":1500,"conversion_rate":7.50}'],
                ['Browser Metrics', '{"browser":"Safari","unique_users":10000,"sessions":20000,"events":140000,"conversions":750,"conversion_rate":7.50}'],
                ['Traffic Source Metrics', '{"traffic_source":"google","unique_users":15000,"sessions":30000,"events":210000,"conversions":1200,"conversion_rate":8.00}'],
                ['Traffic Source Metrics', '{"traffic_source":"direct","unique_users":12500,"sessions":25000,"events":175000,"conversions":900,"conversion_rate":7.20}'],
                ['Hourly Device Pageviews', '{"hour_of_day":9,"desktop":2500,"mobile":1500,"tablet":500,"total":4500,"desktop_pct":55.56,"mobile_pct":33.33,"tablet_pct":11.11}'],
                ['Hourly Device Pageviews', '{"hour_of_day":12,"desktop":3000,"mobile":2250,"tablet":750,"total":6000,"desktop_pct":50.00,"mobile_pct":37.50,"tablet_pct":12.50}'],
                ['Hourly Device Pageviews', '{"hour_of_day":18,"desktop":3500,"mobile":4500,"tablet":1000,"total":9000,"desktop_pct":38.89,"mobile_pct":50.00,"tablet_pct":11.11}']
              ]
            };
          } else {
            // Basic analytics query
            mockResults = {
              columns: ['event_id', 'user_id', 'session_id', 'timestamp', 'event_type', 'page_path', 'properties'],
              rows: [
                [1001, 'user_123', 'sess_a1b2c3', '2023-03-01 08:12:34', 'pageview', '/home', '{"device_type":"desktop","browser":"Chrome","referrer":"google.com"}'],
                [1002, 'user_123', 'sess_a1b2c3', '2023-03-01 08:13:22', 'click', '/home', '{"device_type":"desktop","browser":"Chrome","element_id":"product-category-electronics"}'],
                [1003, 'user_123', 'sess_a1b2c3', '2023-03-01 08:13:45', 'pageview', '/products', '{"device_type":"desktop","browser":"Chrome","referrer":"/home"}'],
                [1004, 'user_456', 'sess_g7h8i9', '2023-03-01 10:05:22', 'pageview', '/home', '{"device_type":"mobile","browser":"Safari","referrer":"facebook.com"}'],
                [1005, 'user_456', 'sess_g7h8i9', '2023-03-01 10:06:17', 'scroll', '/home', '{"device_type":"mobile","browser":"Safari","scroll_depth":65}']
              ]
            };
          }
        } else {
          mockResults = {
            columns: ['result'],
            rows: [['No data found for this query']]
          };
        }

        setQueryResult(mockResults);
      } catch (err) {
        setError(err.message);
        setQueryResult(null);
      } finally {
        setIsExecuting(false);
      }
    }, 1000);
  };

  // Load a sample query
  const loadSampleQuery = (query) => {
    setSqlQuery(query);
  };

  return (
    <div className="db-playground">
      <section className="py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <Link to="/lab" className="inline-block mb-6 text-white hover:text-blue-200 transition-colors">
            ← Back to Lab Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Database Playground</h1>
          <p className="text-xl max-w-3xl">
            Write and execute SQL queries against sample databases with different schemas.
            Perfect for practicing database testing and SQL skills.
          </p>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
      </div>

      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="glass p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <p className="text-gray-700 mb-6">
                This Database Playground allows you to write and execute SQL queries against sample databases.
                Select a database schema, write your query, and click "Execute Query" to see the results.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Important Notes</h3>
                <ul className="list-disc pl-6 space-y-1 text-blue-700">
                  <li>Only SELECT queries are allowed in this playground for security reasons.</li>
                  <li>The databases are reset periodically, so any changes will not persist.</li>
                  <li>Use the sample queries to get started or explore the schema information.</li>
                </ul>
              </div>
            </div>

            {/* Schema Selection */}
            <div className="flex border-b border-gray-300 mb-8 overflow-x-auto">
              {schemas.map((schema) => (
                <button
                  key={schema.id}
                  onClick={() => setActiveSchema(schema.id)}
                  className={`px-6 py-3 font-medium whitespace-nowrap ${
                    activeSchema === schema.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {schema.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Schema Info Sidebar */}
              <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                <div className="neumorphic p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Schema Information</h3>
                  <p className="text-gray-700 mb-4">
                    {activeSchema === 'ecommerce' && 'E-commerce database with products, customers, orders, and order items.'}
                    {activeSchema === 'hr' && 'HR database with employees, departments, and job history.'}
                    {activeSchema === 'library' && 'Library database with books, authors, members, and loans.'}
                  </p>
                  <p className="text-gray-700">
                    Use the sample queries to explore the data in this schema.
                  </p>
                </div>

                {/* Advertisement Space - Sidebar */}
                <div className="ad-sidebar mt-6" aria-label="Advertisement Space">
                  <span className="sr-only">Advertisement Space</span>
                </div>
              </div>

              {/* Query Editor and Results */}
              <div className="md:w-2/3">
                <div className="glass p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold mb-4">SQL Query Editor</h3>

                  <div className="mb-4">
                    <textarea
                      id="sql-query"
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      placeholder="Enter your SQL query here..."
                      className="neumorphic-inset w-full px-4 py-3 rounded-lg font-mono text-sm h-40"
                    ></textarea>
                  </div>

                  <div className="flex flex-wrap justify-between items-center">
                    <button
                      onClick={executeQuery}
                      disabled={isExecuting}
                      className="neumorphic px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                      {isExecuting ? 'Executing...' : 'Execute Query'}
                    </button>

                    <div className="relative mt-4 sm:mt-0">
                      <select
                        onChange={(e) => loadSampleQuery(e.target.value)}
                        className="neumorphic-inset px-4 py-2 rounded-lg appearance-none pr-10 text-gray-700"
                        defaultValue=""
                      >
                        <option value="" disabled>Load Sample Query</option>
                        {sampleQueries[activeSchema]?.map((sample, index) => (
                          <option key={index} value={sample.query}>
                            {sample.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Query Results */}
                <div className="neumorphic p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Query Results</h3>

                  {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                      {error}
                    </div>
                  )}

                  {isExecuting ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Executing query...</p>
                    </div>
                  ) : queryResult ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                          <tr>
                            {queryResult.columns.map((column, index) => (
                              <th key={index} className="px-4 py-2 text-left text-gray-600 font-medium">
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResult.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-2 border-t border-gray-200">
                                  {cell !== null ? String(cell) : <span className="text-gray-400">NULL</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-gray-500 text-sm mt-2">
                        {queryResult.rows.length} {queryResult.rows.length === 1 ? 'row' : 'rows'} returned
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Execute a query to see results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
      </div>

      {/* Help Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto glass p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">SQL Tips</h2>
            <p className="text-gray-700 mb-4">
              Here are some tips for writing SQL queries:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Use <code className="bg-gray-100 px-1 rounded">SELECT *</code> to retrieve all columns from a table.</li>
              <li>Use <code className="bg-gray-100 px-1 rounded">WHERE</code> to filter rows based on conditions.</li>
              <li>Use <code className="bg-gray-100 px-1 rounded">JOIN</code> to combine data from multiple tables.</li>
              <li>Use <code className="bg-gray-100 px-1 rounded">GROUP BY</code> to aggregate data.</li>
              <li>Use <code className="bg-gray-100 px-1 rounded">ORDER BY</code> to sort results.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DbPlayground;
