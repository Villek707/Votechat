<?php
class Controller {
    private $model;

    public function __construct() {
        $this->model = new Model();
    }

    public function list_it() {
        $this->messages = $this->model->messages();
        include("View.php");
    }

    public function send() {
        $this->model->add_message($_POST["name"], $_POST["message"]);
        setcookie("user", $_POST["name"], time()+60*10);
        header("Location: Chat.php?action=list_it");
    }
}
?>
