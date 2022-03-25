<?

function getModel($user, $role) {
  switch($role) {
    case 'admin': return getAdminModel();
    case 'command': return getCommandModel();
    case 'referee': return getRefereeModel($user);
    case 'starter': return getStarterModel($user);
    case 'photographer': return getCommandModel($user);
  }
}

function getAdminModel() {
  global $SQL;
  $model = [];
  $model['users'] = $SQL->fetchMultiple('SELECT ID as id, name, login, role FROM users');
  $model['starters'] = $SQL->fetchMultiple('SELECT ID as id, team, user, disclaimer, g263, birthday FROM starters');
  $model['disciplines'] = $SQL->fetchMultiple('SELECT ID as id, name, description, number, type, multiplier FROM disciplines');
  $model['referees'] = $SQL->fetchMultiple('SELECT ID as id, user, discipline FROM referees');
  $model['teams'] = $SQL->fetchMultiple('SELECT ID as id, name, image, paid, number FROM teams');
  return $model;
}

function getCommandModel() {
  global $SQL, $_CONFIG;
  $model = [];
  $model['disciplines'] = $SQL->fetchMultiple('SELECT ID as id, name, type, description, multiplier, number FROM disciplines ORDER BY number');
  $model['teams'] = $SQL->fetchMultiple('SELECT ID as id, name, image, number, paid FROM teams ORDER BY number');
  foreach ($model['teams'] as $key => $value) {
    $TID = $value['id'];
    $query = <<<EOD
      SELECT starters.ID as id,
      starters.birthday,
      starters.g263,
      starters.disclaimer,
      starters.user,
      users.name
      FROM starters
      LEFT JOIN users ON users.ID = starters.user
      WHERE starters.team=$TID
    EOD;
    $model['teams'][$key]['starters'] = $SQL->fetchMultiple($query);

    $query = <<<EOD
      SELECT
      disciplines.ID as id,
      disciplines.number,
      progress.ID as progress_id,
      progress.state as progress,
      progress.referee as progress_referee,
      progress.date as progress_date,
      valuations.ID as valuation_id,
      valuations.points,
      valuations.penalty,
      valuations.reason,
      valuations.referee as valuation_referee,
      valuations.date as valuation_date,
      users.name as valuation_referee_name
      FROM disciplines
      LEFT JOIN progress ON progress.discipline = disciplines.ID AND progress.team = $TID
      LEFT JOIN valuations ON valuations.discipline = disciplines.ID AND valuations.team = $TID
      LEFT JOIN users ON users.id = valuations.referee
      ORDER BY disciplines.number
    EOD;
    $model['teams'][$key]['disciplines'] = $SQL->fetchMultiple($query);
  }
  return $model;
}

function getRefereeModel($ID) {
  global $SQL, $_CONFIG;
  $model = [];
  $model['disciplines'] = $SQL->fetchMultiple('SELECT discipline FROM referees WHERE user = ' . $ID);
  foreach ($model['disciplines'] as $key => $value) {
    $DID = $value['discipline'];
    $model['disciplines'][$key] = $SQL->fetchArray('SELECT ID as id, name, type, description, number FROM disciplines WHERE ID = ' . $DID);
    $query = <<<EOD
      SELECT
      teams.ID as id,
      teams.name,
      teams.number,
      progress.state,
      valuations.points,
      valuations.penalty,
      valuations.reason,
      valuations.referee
      FROM teams
      LEFT JOIN progress ON progress.discipline = $DID AND progress.team = teams.ID
      LEFT JOIN valuations ON valuations.discipline = $DID AND valuations.team = teams.ID
      ORDER BY teams.number
    EOD;
    $model['disciplines'][$key]['teams'] = $SQL->fetchMultiple($query);
  }
  return $model;
}

function getStarterModel($ID) {
  global $SQL, $_CONFIG;
  $model = [];
  $model['starter'] = $SQL->fetchArray('SELECT ID as id, team FROM starters WHERE user = ' . $ID);
  if ($model['starter']) {
    $model['team'] = $SQL->fetchArray('SELECT ID as id, name, number FROM teams WHERE ID = ' . $model['starter']['team']);
    if ($model['team']) {
      $model['disciplines'] = $SQL->fetchMultiple(<<<EOD
        SELECT
        disciplines.ID as id,
        disciplines.name,
        disciplines.description,
        disciplines.number,
        disciplines.type,
        disciplines.multiplier,
        progress.state,
        valuations.points,
        valuations.penalty,
        valuations.reason
        FROM disciplines
        LEFT JOIN progress ON progress.discipline = disciplines.ID AND progress.team = {$model['team']['id']}
        LEFT JOIN valuations ON valuations.discipline = disciplines.ID AND valuations.team = {$model['team']['id']}
        ORDER BY disciplines.number
        EOD);
    }
  }
  return $model;
}

?>
