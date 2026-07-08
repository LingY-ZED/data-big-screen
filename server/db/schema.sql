CREATE TABLE IF NOT EXISTS hosts (
  host_id VARCHAR(32) NOT NULL PRIMARY KEY,
  hostname VARCHAR(128) NOT NULL,
  owner VARCHAR(64) NOT NULL,
  model VARCHAR(64) NOT NULL,
  location_room VARCHAR(64) NOT NULL,
  rack VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_hosts_room (location_room)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS metrics (
  `mod` VARCHAR(64) NOT NULL PRIMARY KEY,
  metric_type VARCHAR(32) NOT NULL,
  description VARCHAR(128) NOT NULL,
  unit VARCHAR(32) NOT NULL,
  tag VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_metrics_type_tag (metric_type, tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS metric_points (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ts BIGINT UNSIGNED NOT NULL,
  sampled_at DATETIME(3) NOT NULL,
  host_id VARCHAR(32) NOT NULL,
  metric_type VARCHAR(32) NOT NULL,
  `mod` VARCHAR(64) NOT NULL,
  value DECIMAL(18, 4) NOT NULL,
  tag VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_points_type_ts (metric_type, ts),
  INDEX idx_points_mod_ts (`mod`, ts),
  INDEX idx_points_tag_ts (tag, ts),
  INDEX idx_points_host_ts (host_id, ts),
  CONSTRAINT fk_points_host FOREIGN KEY (host_id) REFERENCES hosts(host_id),
  CONSTRAINT fk_points_metric FOREIGN KEY (`mod`) REFERENCES metrics(`mod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
