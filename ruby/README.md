# Amazon Web Crawler

This is a simple web crawler built with Ruby that scrapes product details from Amazon search results. It extracts product titles, prices, and additional information from product pages.

## Features
- Scrapes Amazon search results for product details
- Extracts product title, price, and link
- Fetches "About this item" section from individual product pages
- Uses random User-Agent strings to reduce blocking risk
- Allows searching by product category or user-defined keywords

## Prerequisites
Before running the crawler, ensure you have the following installed:
- [Ruby](https://www.ruby-lang.org/en/downloads/)
- [Bundler](https://bundler.io/) (for managing dependencies)

## Installation
1. Clone this repository:
2. Install dependencies using Bundler:
   ```sh
   bundle install
   ```

## Usage
Run the crawler using the following command:
```sh
ruby web_crawler.rb
```

### Search Modes
The crawler offers two ways to search:
1. **Predefined Category Search**: Crawls a default Amazon category page.
2. **Keyword Search**: Prompts the user to enter keywords to search on Amazon.

#### Example Execution
```
Do you want to search using keywords? (Y/N)
> Y
Enter keywords to search for, divided by space:
> laptop stand
Crawling: https://www.amazon.com/s?k=laptop+stand
Title: Adjustable Laptop Stand
Price: $29.99
Link: https://amazon.com/dp/B08XYZ123
About this item:
- Lightweight and Portable
- Adjustable Height
------------------------------
```

## Dependencies
This project uses the following Ruby gems:
- `nokogiri` - Parses and extracts data from HTML pages
- `faker` - Generates random User-Agent strings to prevent blocking
- `rubocop` - Code style enforcement (development use only)
- `user_agent` - Generates user-agent strings
- `selenium-webdriver` - Automates browsing actions (optional, for future enhancements)
- `sequel` - Database library (included for potential future features)

