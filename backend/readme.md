git clone "lien du projet"
composer install/composer update
//On modifi le .env pour avoir notre shema de donnes
php bin/console d:d:c
php bin/console doctrine:migrations:migrate
Charger les fixtures: php bin/console doctrine:fixtures:load

Pour generer de nouvelle migrations: php bin/console doctrine:migrations:generate
