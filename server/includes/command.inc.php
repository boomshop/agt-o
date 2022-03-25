<?
function handleRequest($data, $user, $role) {
  global $SQL, $_ERROR, $_CONFIG;
  $error = '';

  switch($data['action']) {
    case 'uploadTeamImage':
      $team = $SQL->fetchArray('SELECT image FROM teams WHERE ID=' . $data['id']);

      $image_parts = explode(";base64,", $data['data']);
      $image_type_aux = explode("image/", $image_parts[0]);
      $image_type = $image_type_aux[1];
      $image_base64 = base64_decode($image_parts[1]);
      $fname = 'team_' . $data['id'] . '_' . md5($data['data']) . '.' . $image_type;
      $file = $_CONFIG['upload'] . $fname;
      if ($team['image'])
        unlink($_CONFIG['upload'] . $team['image']);
      if (file_put_contents($file, $image_base64)) {
        $SQL->query('UPDATE teams SET image=\'' . $fname . '\' WHERE ID = ' . $data['id']);
      } else {
        $error = 'Upload failed';
      }
      break;
    case 'editTeam':
      $d = [ 'paid'=>$data['paid'] ];
      $query = $SQL->buildUpdateQuery('teams', $d, 'WHERE ID = ' . $SQL->escape($data['id']));
      $SQL->query($query);
      $error = $SQL->lastError();
      break;
    case 'editStarter':
      $d = [ 'g263'=>$data['g263'], 'disclaimer'=>$data['disclaimer'] ];
      $query = $SQL->buildUpdateQuery('starters', $d, 'WHERE ID = ' . $SQL->escape($data['id']));
      $SQL->query($query);
      $error = $SQL->lastError();
      break;
    case 'editConfig':
      if (isset($data['started'])) {
        $query = 'UPDATE config SET value=\'' . $SQL->escape($data['started']) . '\' WHERE name = \'started\'';
        $error=$query;
        $SQL->query($query);
      }
      if (isset($data['ended'])) {
        $query = 'UPDATE config SET value=\'' . $SQL->escape($data['ended']) . '\' WHERE name = \'ended\'';
        $error=$query;
        $SQL->query($query);
      }
      $error = $SQL->lastError();
  }

  return ['model' => getModel($user, $role), 'error' => $error ];
}
?>
