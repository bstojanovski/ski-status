<?php
    $db = new PDO("mysql:host=localhost:3306;dbname=skistatus", "root", "");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents('php://input'), true);

    if ($_SERVER['REQUEST_METHOD'] == "GET") {
        $statement = $db->query('SELECT * FROM skilifts');
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        echo json_encode($statement->fetchAll());
    }

    if ($_SERVER['REQUEST_METHOD'] == "PUT") {
        // secret parameter should be "bojan" or fee2c775c18a12b7b52b58129b00e1bd in MD5
        if($data['secret'] == "fee2c775c18a12b7b52b58129b00e1bd") {
            $sql = 'UPDATE `skilifts` SET `status` = :status WHERE `id` = :id';
            $query = $db->prepare($sql);
            $query->bindParam(':status', $data['status']);
            $query->bindParam(':id', $data['id']);
            $query->execute();
            
            $count = $query->rowCount();
            if($count == '0'){
                echo "Failed";
                http_response_code(400);
            }
            else{
                echo "Success";
                http_response_code(200);
            }
        } else {
            echo $data['secret']." is not the magic word!";
            http_response_code(403);
        }
    }
?>