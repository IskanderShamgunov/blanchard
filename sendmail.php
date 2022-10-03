<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'libs/phpmailer/PHPMailer.php'
require 'libs/phpmailer/Exception.php'

$mail = new PHPMailer(true);
$mail->CharSet = "UTF-8";
$mail->IsHTML(true);

// $mail->setFrom('submit_test@mail.ru', 'Заявка');
$mail->addAddress('submit_test@mail.ru');
$mail->Subject = 'Заявка Blanchard'

$body = '<h1>Данные пользователя</h1>';
$body.= '<p>Имя: '.$_POST['name'].'</p>'
$body.= '<p>Телефон: '.$_POST['tel'].'</p>'

$mail->Body = $body;

if (!$mail->send()) {
  $message = 'Ошибка';
} else {
  $message = 'Данные отправлены'
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);

?>
