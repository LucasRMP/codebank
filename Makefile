up:
	cd apache-kafka/ && docker-compose up -d && cd ../codebank && docker-compose up -d

down: 
	cd apache-kafka/ && docker-compose down && cd ../codebank && docker-compose down