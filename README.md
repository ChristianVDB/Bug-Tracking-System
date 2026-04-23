# Bugiz: Bug Tracking System
**WPR281 - Project**

## Team Members
* **Arno Mostert**
* **Christian van den Brink**
* **Gavin Cullen**
* **Hugo Pelser**

---

## Introduction
Bugiz is a website that allows software developers to track software errors (bugs) and fix them. Keeping track of these bugs is a much-needed characteristic of a good software engineering team. A bug in this sense refers to a flaw in a program that stops it from functioning correctly.

## Core Functional Features
This system provides a complete end-to-end workflow to manage software quality:
* **Issue Creation**: Users can create tickets to report bugs, including summaries, descriptions, and identified dates.
* **Assignment System**: Users can assign tickets to a specific developer.
* **Detailed View**: Users can view a full breakdown of any specific ticket.
* **Live Editing**: Users can update ticket data at any time, reflecting real-time progress.

## Technical Implementation
### Storage Strategy
Bugiz does not use a server or paid database; instead, it uses a **Web Storage API (localStorage)**. 
* **Persistence**: LocalStorage allows the website to store data locally for that website only, ensuring data stays saved even if the browser is closed and reopened.
* **Mechanism (JSON Lifecycle)**:
    * **Saving**: The function `JSON.stringify()` is used to “pack” the data, turning the object value into a long string value for storage.
    * **Retrieving**: The function `JSON.parse()` is used to “unpack” the data, turning it back into its original object value to ensure it is usable later in the program.

## Data Architecture
Bugiz uses three **Constructor Functions** to ensure data integrity. Every object is guaranteed to have the same mandatory fields before it is saved:

### 1. Tickets:
* Brief summary of the bug
* Full description of the bug
* Reporter name
* Date reported
* Associated project
* Assigned developer
* Status (Open, Resolved, Overdue)

### 2. User:
* ID, Name, Surname, Username, Password, and Email address

### 3. Project:
* Project ID, Project Name, Summary, and Description

## System Logic
Decisions are primarily made through **Status Checks** and **Consistency**:
* **Status Logic**: Tickets are automatically categorized as “Complete”, “In Progress”, or “Overdue”. Tickets with the same category can be viewed separately.
* **Consistency**: If tickets are edited, the system ensures these changes are immediately reflected across the entire program.

## Testing & Data Evidence
The system comes pre-loaded with a comprehensive test dataset to demonstrate functionality:
* **Pre-loaded Data**: 20 tickets, 10 projects, and 10 users.
* **Varied Attributes**: 
    * **Statuses**: A mix of "In Progress" and "Overdue" tickets are used to show the logic.
    * **Assignments**: Tickets are spread across 10 different developers to test assignment functionality.
    * **Project Links**: Tickets are divided between 10 projects to demonstrate filtering.

## Group Collaboration and Roles
| Team Member | Primary Responsibility | Key Tasks |
| :--- | :--- | :--- |
| **Arno Mostert** | JavaScript & Test Data | Coding JavaScript and generating test data |
| **Christian van den Brink** | UI & Markdown Structure | Making the initial design and creating the markdown structure |
| **Gavin Cullen** | JavaScript | Coding JavaScript |
| **Hugo Pelser** | CSS & HTML | Coding CSS and HTML |

---
*Developed for WPR281 Project.*
