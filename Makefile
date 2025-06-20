dev_build:
	docker compose -f docker-compose.yml up --build -d --remove-orphans
dev_build_debug:
	docker compose -f docker-compose.yml up --build --remove-orphans
dev_up:
	docker compose -f docker-compose.yml up -d
dev_up_debug:
	docker compose -f docker-compose.yml up
dev_down:
	docker compose -f docker-compose.yml down
view_logs:
	docker compose logs -f

# enter_frontend:
# 	docker exec -it jawabot-development-frontend-1 bash
# enter_backend:
# 	docker exec -it jawabot-development-backend-1 bash
# enter_nginx:
# 	docker exec -it nginx-app-1 bash

# remove_image:
# 	docker rmi crmwhatsappai-development-frontend && docker rmi postgres && docker rmi crmwhatsappai-development-ai
remove_image:
	docker rmi crmwhatsappai-development-backend