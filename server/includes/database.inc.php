<?

class SQL {

    var $server;
    var $db;
    var $acc;
    var $pw;
    var $connect;

    function __construct($db_server, $db_database, $db_account, $db_password, $db_charset = "utf8")
    {
        $this->server = $db_server;
        $this->db = $db_database;
        $this->acc = $db_account;
        $this->pw = $db_password;

        $this->connect = mysqli_connect($this->server, $this->acc, $this->pw, $this->db);

        if ($this->connect)
        {
            mysqli_set_charset($this->connect, $db_charset);
            return true;
        }
        die('Database Error: Couldn\'t connect');
        $this->query("SET sql_mode = ''");
    }
    /*
    Usage: $dbconn = new Coresql($db_server, $db_database, $db_account, $db_password);
    */

    function query($statement)
    {
        if (mysqli_query($this->connect, $statement))
            return true;
        return false;
    }
    /*
    Usage: $query = $dbconn->query("UPDATE table SET field = 'something'");
    */

    function fetchArray($statement)
    {
        $query = mysqli_query($this->connect, $statement) or die (mysqli_error($this->connect));
        return mysqli_fetch_array($query, MYSQLI_ASSOC);
    }
    /*
    Usage: $result = $dbconn->fetchArray("SELECT * FROM table WHERE field != 'something'");
    */

    function fetchMultiple($statement)
    {
        #echo $statement;
        $result_multiple = array();
        $query = mysqli_query($this->connect, $statement) or die (mysqli_error($this->connect));
        while ($result = mysqli_fetch_array($query, MYSQLI_ASSOC))
        {
            $result_multiple[] = $result;
        }
        return $result_multiple;
    }
    /*
    Usage:  $result = $dbconn->fetchMultiple("SELECT * FROM table WHERE field LIKE '%omethin%'");
        foreach ($result as $result_detailed) {
            print "<tr>\n";
            foreach ($result_detailed as $key=>$elem) {
                print "<td>$elem[value]</td>\n";
            }
            print "</tr>\n";
        }
    */

    function countRows($statement)
    {
        $query = mysqli_query($this->connect, $statement) or die (mysqli_error($this->connect));
        return mysqli_num_rows($query);
    }
    /*
    Usage: $rows = $dbconn->countRows("SELECT * FROM table WHERE field = 'something'");
    */

    function countFields()
    {
        return mysqli_field_count($this->connect);
    }
    /*
    Usage: $rows = $dbconn->countRows("SELECT * FROM table WHERE field = 'something'");
    */

    function listFields($table, $full)
    {
        $result = array();
        $query = mysqli_query($this->connect, 'SHOW COLUMNS FROM ' . $table . '') or die (mysqli_error($this->connect));
        while ($row = mysqli_fetch_assoc($query)) {
            if ($full)
                $result[] = $row;
            else
                $result[] = $row['Field'];
        }
        return $result;
    }
    /*
    Usage: $fields = $dbconn->listFields("table_name", true); gives assoc arrays with full information. false returns array with field names
    */

    function tableExists($table)
    {
        $res = mysqli_query($this->connect, "SHOW TABLES LIKE '$table'");
        return ($res and mysqli_num_rows($res) > 0);
    }

    function escape($string)
    {
        return mysqli_real_escape_string($this->connect, $string);
    }

    function lastError()
    {
        return mysqli_error($this->connect);
    }

    function lastID()
    {
        return mysqli_insert_id($this->connect);
    }

    function close()
    {
        if (mysqli_close($this->connect))
            return true;
        return false;
    }
    /*
    Usage: $close = $dbconn->close();
    */
    function buildInsertQuery($table, $data)
    {
      global $SQL;
      $fields = [];
      $values = [];
      foreach($data as $key => $val) {
        if (isset($val)) {
          $fields[] = $SQL->escape($key);
          $values[] = $SQL->escape($val);
        }
      }
      $query = 'INSERT INTO ' . $SQL->escape($table);
      if (count($fields))
        $query .= ' (' . implode(',', $fields) . ') VALUES (\'' . implode('\',\'', $values) . '\')';
      return $query;
    }

    function buildUpdateQuery($table, $data, $where)
    {
      global $SQL;
      $query = 'UPDATE ' . $SQL->escape($table) . ' SET ';
      $d = [];
      foreach($data as $key => $val) {
        if (isset($val))
          $d[] = $SQL->escape($key) . ' = \'' . $SQL->escape($val) . '\'';
      }
      $query .= implode(', ', $d);
      if ($where)
        $query .= ' ' . $where;
      return $query;
    }
}
?>
