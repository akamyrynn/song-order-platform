# Requirements Document

## Introduction

Платформа для создания персонализированных песен на заказ с веб-интерфейсом, конструктором параметров, интеграцией с Telegram-ботом, системой управления заказами и оплатой.

## Glossary

- **Platform**: Веб-приложение для создания и управления заказами песен
- **Constructor**: Интерфейс для выбора параметров будущей песни
- **Order**: Заказ клиента с уникальным номером и параметрами песни
- **Client**: Пользователь, который заказывает песню
- **Admin_Panel**: Панель администратора для управления заказами
- **Telegram_Bot**: Бот для коммуникации с клиентами и отправки уведомлений
- **Payment_System**: Система обработки платежей
- **Song_File**: Готовый аудиофайл песни

## Requirements

### Requirement 1

**User Story:** Как клиент, я хочу попасть на главную страницу и перейти к конструктору, чтобы начать создание персонализированной песни.

#### Acceptance Criteria

1. THE Platform SHALL display a landing page with clear navigation to the constructor
2. WHEN a user clicks the constructor button, THE Platform SHALL redirect to the constructor page
3. THE Platform SHALL maintain consistent branding and design throughout navigation


### Requirement 2

**User Story:** Как клиент, я хочу заполнить параметры песни в конструкторе, чтобы указать все необходимые детали для создания персонализированной песни.

#### Acceptance Criteria

1. THE Constructor SHALL display form fields for song parameters including recipient information, occasion, style preferences, and special requests
2. WHEN a user fills in required fields, THE Constructor SHALL validate the input data
3. WHEN a user submits the form, THE Constructor SHALL create a new order with a unique order number
4. THE Constructor SHALL persist all form data to the database immediately upon submission

### Requirement 3

**User Story:** Как клиент, я хочу получить номер заказа и указать свой номер телефона после заполнения конструктора, чтобы система могла связаться со мной.

#### Acceptance Criteria

1. WHEN an order is created, THE Platform SHALL generate a unique order number
2. WHEN an order is created, THE Platform SHALL display the order number to the client
3. THE Platform SHALL prompt the client to enter their phone number
4. WHEN a phone number is provided, THE Platform SHALL validate the phone number format
5. THE Platform SHALL store the phone number associated with the order


### Requirement 4

**User Story:** Как клиент, я хочу быть перенаправленным в Telegram-бот с моим номером заказа, чтобы получать уведомления и общаться с создателями песни.

#### Acceptance Criteria

1. WHEN a client submits their phone number, THE Platform SHALL redirect the client to the Telegram bot with the order number as a parameter
2. WHEN a client opens the Telegram bot link, THE Telegram_Bot SHALL greet the client and associate their Telegram account with the order number
3. THE Telegram_Bot SHALL store the Telegram user ID linked to the order number
4. THE Telegram_Bot SHALL confirm successful order registration to the client

### Requirement 5

**User Story:** Как администратор, я хочу видеть все данные заказа в удобном формате, чтобы создать песню на основе предоставленной информации.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display a list of all orders with their status
2. WHEN an administrator selects an order, THE Admin_Panel SHALL display all order details including constructor parameters, phone number, Telegram username, and order number
3. THE Admin_Panel SHALL organize order data in a readable and structured format
4. THE Admin_Panel SHALL allow filtering and searching orders by order number, status, or date


### Requirement 6

**User Story:** Как администратор, я хочу загрузить готовую песню к заказу и автоматически уведомить клиента, чтобы он мог прослушать результат.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide an interface to upload a song file for a specific order
2. WHEN a song file is uploaded, THE Platform SHALL store the file securely and associate it with the order
3. WHEN a song file is uploaded, THE Platform SHALL update the order status to "ready"
4. WHEN a song file is uploaded, THE Telegram_Bot SHALL send a notification to the client with a link to listen to the song
5. THE Platform SHALL generate a secure, unique listening link for each song file

### Requirement 7

**User Story:** Как клиент, я хочу выбрать тариф и оплатить заказ, чтобы получить готовую песню.

#### Acceptance Criteria

1. WHEN a client receives the song preview notification, THE Platform SHALL display available pricing tiers
2. THE Platform SHALL present multiple pricing options with clear descriptions of what each tier includes
3. WHEN a client selects a tier, THE Platform SHALL redirect to the payment interface
4. THE Payment_System SHALL process the payment securely
5. WHEN payment is successful, THE Platform SHALL update the order status to "paid"


### Requirement 8

**User Story:** Как клиент, я хочу получить файл песни в Telegram после оплаты, чтобы скачать и использовать его.

#### Acceptance Criteria

1. WHEN payment is confirmed, THE Telegram_Bot SHALL send the song file to the client
2. THE Telegram_Bot SHALL send a message customized based on the selected pricing tier
3. THE Telegram_Bot SHALL include tier-specific content in the message (e.g., additional materials for premium tiers)
4. THE Platform SHALL mark the order as "completed" after file delivery

### Requirement 9

**User Story:** Как клиент и администратор, я хочу общаться через Telegram-бот, чтобы задавать вопросы и получать поддержку по заказу.

#### Acceptance Criteria

1. THE Telegram_Bot SHALL support bidirectional messaging between clients and administrators
2. WHEN a client sends a message, THE Admin_Panel SHALL display the message with the associated order number
3. WHEN an administrator sends a message through the Admin_Panel, THE Telegram_Bot SHALL deliver it to the client
4. THE Platform SHALL store all message history associated with each order
5. THE Admin_Panel SHALL display the complete conversation thread for each order


### Requirement 10

**User Story:** Как система, я хочу хранить все данные заказов в структурированном виде, чтобы обеспечить целостность данных и возможность их извлечения.

#### Acceptance Criteria

1. THE Platform SHALL store order data including order number, constructor parameters, phone number, Telegram user ID, status, timestamps, and pricing tier
2. THE Platform SHALL store song files with secure access controls
3. THE Platform SHALL store message history for each order
4. THE Platform SHALL maintain referential integrity between orders, users, messages, and files
5. WHEN data is queried, THE Platform SHALL return complete and accurate information

### Requirement 11

**User Story:** Как администратор, я хочу отслеживать статус каждого заказа, чтобы управлять рабочим процессом создания песен.

#### Acceptance Criteria

1. THE Platform SHALL maintain order status states: "new", "in_progress", "ready", "paid", "completed"
2. WHEN an order status changes, THE Platform SHALL update the timestamp of the status change
3. THE Admin_Panel SHALL display the current status for each order
4. THE Admin_Panel SHALL allow administrators to manually update order status when needed
5. WHEN order status changes to specific states, THE Platform SHALL trigger appropriate notifications


### Requirement 12

**User Story:** Как клиент, я хочу взаимодействовать с визуально привлекательным и запоминающимся интерфейсом, чтобы получить уникальный опыт заказа персонализированной песни.

#### Acceptance Criteria

1. THE Platform SHALL use distinctive, characterful typography that avoids generic fonts like Arial, Inter, or Roboto
2. THE Platform SHALL implement a cohesive aesthetic direction with intentional color schemes using CSS variables
3. THE Platform SHALL include purposeful animations and micro-interactions for key user actions
4. THE Platform SHALL use unexpected layouts with asymmetry, overlap, or diagonal flow where appropriate
5. THE Platform SHALL incorporate atmospheric backgrounds and visual details such as gradient meshes, textures, or layered transparencies
6. THE Platform SHALL maintain visual consistency across all pages while avoiding generic AI-generated aesthetics
7. THE Platform SHALL implement motion effects that enhance user experience, including page load animations with staggered reveals
8. THE Platform SHALL ensure all visual elements serve the overall aesthetic vision and create a memorable user experience
9. THE Platform SHALL balance implementation complexity with aesthetic vision, using elaborate code for maximalist designs or precision and restraint for minimalist approaches
10. THE Platform SHALL create a distinctive visual identity that differentiates it from generic web applications
