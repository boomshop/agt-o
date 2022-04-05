<?
function generatePassword($pw) {
  global $_CONFIG;
  return md5($pw . $_CONFIG['SQL_SALT']);
}
function handleRequest($data, $user, $role) {
  global $SQL, $_ERROR;
  $error = '';

  switch($data['action']) {
    case 'addUser':
      if (!$data['password']) {
        error(5);
      }
      $query = $SQL->buildInsertQuery('users', ['name'=>$data['name'], 'role'=>$data['role'], 'login'=>$data['login'], 'password'=>generatePassword($data['password'])]);
      $SQL->query($query);
      $error = $SQL->lastError();
      break;
    case 'editUser':
      $d = ['name'=>$data['name'], 'login'=>$data['login'], 'role'=>$data['role']];
      if ($data['password']) {
        $d['password'] = generatePassword($data['password']);
      }
      $query = $SQL->buildUpdateQuery('users', $d, 'WHERE ID = ' . $SQL->escape($data['id']));
      $SQL->query($query);
      $error = $SQL->lastError();
      break;
    case 'removeUser':
      $SQL->query('DELETE FROM users WHERE ID = ' . $SQL->escape($data['id']));
      $SQL->query('DELETE FROM referees WHERE user = ' . $SQL->escape($data['id']));
      $SQL->query('DELETE FROM starters WHERE user = ' . $SQL->escape($data['id']));
      $SQL->query('DELETE FROM valuations WHERE referee = ' . $SQL->escape($data['id']));
      $SQL->query('DELETE FROM progress WHERE referee = ' . $SQL->escape($data['id']));
      $error = $SQL->lastError();
      break;

    case 'addStarter':
      $query = $SQL->buildInsertQuery('starters', [ 'user'=>$data['user'], 'team'=>$data['team'], 'g263'=>$data['g263'], 'disclaimer'=>$data['disclaimer'], 'birthday'=>$data['birthday'] ]);
      $SQL->query($query);
      $error = $SQL->lastError();
      break;
    case 'editStarter':
      $d = [ 'user'=>$data['user'], 'team'=>$data['team'], 'g263'=>$data['g263'], 'disclaimer'=>$data['disclaimer'], 'birthday'=>$data['birthday'] ];
      $query = $SQL->buildUpdateQuery('starters', $d, 'WHERE ID = ' . $SQL->escape($data['id']));
      $SQL->query($query);
      $error = $SQL->lastError();
      break;
    case 'removeStarter':
      $SQL->query('DELETE FROM starters WHERE ID = ' . $SQL->escape($data['id']));
      $error = $SQL->lastError();
      break;

    case 'addTeam':
      $query = $SQL->buildInsertQuery('teams', [ 'name'=>$data['name'], 'image'=>$data['image'], 'paid'=>$data['paid'], 'number'=>$data['number'] ]);
      $SQL->query($query);
      $error = $SQL->lastError();
      break;
    case 'editTeam':
      $d = [ 'name'=>$data['name'], 'image'=>$data['image'], 'paid'=>$data['paid'], 'number'=>$data['number'] ];
      $query = $SQL->buildUpdateQuery('teams', $d, 'WHERE ID = ' . $SQL->escape($data['id']));
      $SQL->query($query);
      $error = $SQL->lastError();
      break;
    case 'removeTeam':
      $SQL->query('DELETE FROM teams WHERE ID = ' . $SQL->escape($data['id']));
      $SQL->query('DELETE FROM valuations WHERE team = ' . $SQL->escape($data['id']));
      $SQL->query('DELETE FROM progress WHERE team = ' . $SQL->escape($data['id']));
      $error = $SQL->lastError();
      break;

    case 'addReferee':
      $query = $SQL->buildInsertQuery('referees', [ 'user'=>$data['user'], 'discipline'=>$data['discipline'] ]);
      $SQL->query($query);
      $error = $SQL->lastError();
      break;
    case 'editReferee':
      $d = [ 'user'=>$data['user'], 'discipline'=>$data['discipline'] ];
      $query = $SQL->buildUpdateQuery('referees', $d, 'WHERE ID = ' . $SQL->escape($data['id']));
      $SQL->query($query);
      $error = $SQL->lastError();
      break;
    case 'removeReferee':
      $SQL->query('DELETE FROM referees WHERE ID = ' . $SQL->escape($data['id']));
      $SQL->query('DELETE FROM valuations WHERE referee = ' . $SQL->escape($data['id']));
      $SQL->query('DELETE FROM progress WHERE referee = ' . $SQL->escape($data['id']));
      $error = $SQL->lastError();
      break;

    case 'addDiscipline':
      $query = $SQL->buildInsertQuery('disciplines', [ 'name'=>$data['name'], 'description'=>$data['description'], 'number'=>$data['number'], 'multiplier'=>$data['multiplier'], 'type'=>$data['type'] ]);
      $SQL->query($query);
      $error = $SQL->lastError();
      break;
    case 'editDiscipline':
      $d = [ 'name'=>$data['name'], 'description'=>$data['description'], 'number'=>$data['number'], 'multiplier'=>$data['multiplier'], 'type'=>$data['type'] ];
      $query = $SQL->buildUpdateQuery('disciplines', $d, 'WHERE ID = ' . $SQL->escape($data['id']));
      $SQL->query($query);
      $error = $SQL->lastError();
      break;
    case 'removeDiscipline':
      $SQL->query('DELETE FROM disciplines WHERE ID = ' . $SQL->escape($data['id']));
      $SQL->query('DELETE FROM referees WHERE discipline = ' . $SQL->escape($data['id']));
      $SQL->query('DELETE FROM progress WHERE discipline = ' . $SQL->escape($data['id']));
      $SQL->query('DELETE FROM valuations WHERE discipline = ' . $SQL->escape($data['id']));
      $error = $SQL->lastError();
      break;

    case 'fullReset':
      $SQL->query('DELETE FROM disciplines');
      $SQL->query('DELETE FROM valuations');
      $SQL->query('DELETE FROM progress');
      $SQL->query('DELETE FROM referees');
      $SQL->query('DELETE FROM teams');
      $SQL->query('DELETE FROM starters');
      $SQL->query('DELETE FROM users WHERE ID > 1');

      $SQL->query('ALTER TABLE disciplines AUTO_INCREMENT=1');
      $SQL->query('ALTER TABLE valuations AUTO_INCREMENT=1');
      $SQL->query('ALTER TABLE progress AUTO_INCREMENT=1');
      $SQL->query('ALTER TABLE referees AUTO_INCREMENT=1');
      $SQL->query('ALTER TABLE teams AUTO_INCREMENT=1');
      $SQL->query('ALTER TABLE starters AUTO_INCREMENT=1');
      $SQL->query('ALTER TABLE users AUTO_INCREMENT=2');

      $SQL->query('UPDATE config SET value=\'\' WHERE name=\'started\'');
      $SQL->query('UPDATE config SET value=\'\' WHERE name=\'ended\'');

      $SQL->query('UPDATE users SET password=\'' . generatePassword('admin') . '\', login=\'admin\', name=\'Administrator\', role=\'admin\' WHERE ID=1');
      break;

    case 'gameReset':
      $SQL->query('DELETE FROM valuations');
      $SQL->query('DELETE FROM progress');

      $SQL->query('ALTER TABLE valuations AUTO_INCREMENT=1');
      $SQL->query('ALTER TABLE progress AUTO_INCREMENT=1');

      $SQL->query('UPDATE config SET value=\'\' WHERE name=\'started\'');
      $SQL->query('UPDATE config SET value=\'\' WHERE name=\'ended\'');
      break;
  }

  // return ['model' => getModel($user, $role), 'sql' => $error, 'query' => $query];
  return ['model' => getModel($user, $role)];
}
?>
