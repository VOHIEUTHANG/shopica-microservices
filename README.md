<a href="https://dot.net/architecture">
   <img src="https://shopica-client.hvtauthor.com/assets/images/logo.PNG" alt="eShop logo" title="eShopOnContainers" align="right" height="60" />
</a>

# .NET Microservices Sample Reference Application

Sample .NET Core reference application, based on a simplified microservices architecture and Docker containers.

## SPA Client Application (Angular)

![](/shopica-services/image/shopica-client.png)

## SPA Admin Application (Angular)

![](/shopica-services/image/shopica-admin.png)

## Backend Health Check-UI

![](/shopica-services/image/shopica-health-check.png)

## Logging with Elasticsearch, Kibana, Logstash

![](/shopica-services/image/shopica-logging.png)

## Getting Started

Make sure you have [installed](https://docs.docker.com/docker-for-windows/install/) and [configured](https://github.com/dotnet-architecture/eShopOnContainers/wiki/Windows-setup#configure-docker) docker in your environment. After that, you can run the below commands from the **/src/** directory and get started with the `ShopicaOnContainers` immediately.

```powershell
docker-compose build
docker-compose up
```

You should be able to browse different components of the application by using the below URLs :

```
Web API :  https://localhost:7066/swagger/index.html
```

### Architecture overview

This reference application is cross-platform at the server and client-side, thanks to .NET 8 services capable of running on Linux or Windows containers depending on your Docker host, and to Xamarin for mobile apps running on Android, iOS, or Windows/UWP plus any browser for the client web apps.
The architecture proposes a microservice oriented architecture implementation with multiple autonomous microservices (each one owning its own data/db) and implementing different approaches within each microservice (simple CRUD) using HTTP as the communication protocol between the client apps and the microservices and supports asynchronous communication for data updates propagation across multiple services based on Integration Events and an Event Bus (a light message broker, to choose between RabbitMQ or Azure Service Bus, underneath) plus other features defined at the [roadmap](https://github.com/dotnet-architecture/eShopOnContainers/wiki/Roadmap).

![](/shopica-services/image/shopica-architecture.png)

## Related documentation and guidance

You can find the related reference **Guide/eBook** focusing on **architecting and developing containerized and microservice-based .NET Applications** (download link available below) which explains in detail how to develop this kind of architectural style (microservices, Docker containers, Domain-Driven Design for certain microservices) plus other simpler architectural styles, like monolithic apps that can also live as Docker containers.

There are also additional eBooks focusing on Containers/Docker lifecycle (DevOps, CI/CD, etc.) with Microsoft Tools, already published plus an additional eBook focusing on Enterprise Apps Patterns with Xamarin.Forms.
You can download them and start reviewing these Guides/eBooks here:

| Architecting & Developing                                                                              | Containers Lifecycle & CI/CD                                                                       | App patterns with Xamarin.Forms                                                                                          |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [![](/shopica-services/image/architecture-book-cover-large-we.png)](https://aka.ms/microservicesebook) | [![](/shopica-services/image/devops-book-cover-large-we.png)](https://aka.ms/dockerlifecycleebook) | [![](/shopica-services/image/xamarin-enterprise-patterns-ebook-cover-large-we.png)](https://aka.ms/xamarinpatternsebook) |
| <sup> <a href='https://aka.ms/microservicesebook'>**Download PDF**</a> </sup>                          | <sup> <a href='https://aka.ms/dockerlifecycleebook'>**Download PDF** </a> </sup>                   | <sup> <a href='https://aka.ms/xamarinpatternsebook'>**Download PDF** </a> </sup>                                         |

For more free e-Books check out [.NET Architecture center](https://dot.net/architecture). If you have an e-book feedback, let us know by creating a new issue here: <https://github.com/dotnet-architecture/ebooks/issues>

## Are you new to **microservices** and **cloud-native development**?

Take a look at the free course [Create and deploy a cloud-native ASP.NET Core microservice](https://docs.microsoft.com/en-us/learn/modules/microservices-aspnet-core/) on MS Learn. This module explains microservices concepts, cloud-native technologies, and reduces the friction in getting started with `eShopOnContainers`.

## Read further

- [Explore the application](https://github.com/dotnet-architecture/eShopOnContainers/wiki/Explore-the-application)
- [Explore the code](https://github.com/dotnet-architecture/eShopOnContainers/wiki/Explore-the-code)

## Sending feedback and pull requests

Read the planned [Roadmap](https://github.com/dotnet-architecture/eShopOnContainers/wiki/Roadmap) within the Wiki for further info about possible new implementations and provide feedback at the [ISSUES section](https://github.com/dotnet/eShopOnContainers/issues) if you'd like to see any specific scenario implemented or improved. Also, feel free to discuss on any current issue.
