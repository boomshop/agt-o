<?
header('Access-Control-Allow-Origin: http://127.0.0.1:3000', false);
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

session_set_cookie_params(['SameSite' => 'None', 'Secure' => true]);

ini_set('display_errors', 0);
error_reporting(E_ALL);

include('includes/errors.inc.php');

function response($data) {
  global $_CONFIG, $SQL;
  $data['config'] = [ 'map' => $_CONFIG['map'], 'title' => $_CONFIG['title'], 'images' => $_CONFIG['images'] ];
  $res = $SQL->fetchMultiple('SELECT name, value FROM config');
  foreach($res as $key => $value) {
    $data['config'][$value['name']] = $value['value'];
  }
  echo json_encode($data);
  exit(0);
}

function error($error) {
  global $_ERROR;
  echo json_encode(array('error' => $_ERROR[$error]));
  exit($error);
}

session_start();

$_JSON = file_get_contents('php://input');
$_DATA = get_object_vars(json_decode($_JSON));

// debug, REMOVE!
// $_SESSION['user'] = 1;
// $_SESSION['role'] = "admin";

// debug, REMOVE!
// if ($_GET['action'])
//   $_DATA = $_GET;

if ((!$_SESSION['user'] OR !$_SESSION['role']) AND $_DATA['action'] != 'login') {
  error(1);
}

include('includes/database.inc.php');
include('includes/config.inc.php');
include('includes/models.inc.php');
include('includes/powers.inc.php');

$SQL = new SQL($_CONFIG['SQL_SERVER'], $_CONFIG['SQL_DATABASE'], $_CONFIG['SQL_USER'], $_CONFIG['SQL_PASS']);

if ($_DATA['action'] == 'login' AND $_DATA['login'] AND $_DATA['password']) {
  $pass = md5($_DATA['password'] . $_CONFIG['SQL_SALT']);
  $login = $SQL->escape($_DATA['login']);
  $query = 'SELECT * FROM users WHERE login = "' . $login . '" AND password = "' . $pass . '"';
  $res = $SQL->fetchArray($query);
  if ($res) {
    $_SESSION['user'] = $res['ID'];
    $_SESSION['role'] = $res['role'];
    $res = array(
      'model' => getModel($res['ID'], $res['role']),
      'role' => $res['role'],
      'user_id' => $res['ID'],
      'user_name' => $res['name'],
    );
    response($res);
  } else {
    error(2);
  }
}

if ($_DATA['action'] == 'logout') {
  session_unset();
  $_SESSION = array();
  if (session_id() != "" || isset($_COOKIE[session_name()]))
    setcookie(session_name(), '', time() - 42000, '/');
  response(array('role' => '', 'user' => 0));
}

if ($_DATA['action'] == 'data') {
  response(['model' => getModel($_SESSION['user'], $_SESSION['role'])]);
}

if ($_DATA['action'] == 'config') {
  response([]);
}

if (!$_DATA['action']) {
  error(3);
}

if (!in_array($_DATA['action'], $_POWERS[$_SESSION['role']])) {
  error(4);
}

include('includes/' . $_SESSION['role'] . '.inc.php');

response(handleRequest($_DATA, $_SESSION['user'], $_SESSION['role']));
?>
