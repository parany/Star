using System.Web.Http;

namespace Star.Api
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{param}/{param2}",
                defaults: new { param = RouteParameter.Optional, param2 = RouteParameter.Optional }
            );
        }
    }
}
